import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import Groq from 'groq-sdk';
import { buildMasterPrompt } from '@/lib/ai/prompt';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    if (!uid) return NextResponse.json({ error: 'Missing UID' }, { status: 400 });

    const payload = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    // 1. Fetch user settings to get the secret
    const { data: settings, error: sError } = await supabase
      .from('settings_portfolio')
      .select('*')
      .eq('user_id', uid)
      .single();

    if (sError || !settings) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 2. Verify signature
    const hmac = crypto.createHmac('sha256', settings.webhook_secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    
    if (signature !== digest) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(payload);

    // 3. Extract commit and filter noise
    if (data.commits && data.commits.length > 0) {
      const commit = data.commits[0];
      const message = commit.message.toLowerCase();
      
      const isNoise = 
        message.includes('typo') || 
        message.includes('wip') || 
        message.includes('merge') || 
        message.startsWith('docs:') ||
        message.startsWith('chore:') ||
        message.startsWith('test:') ||
        message.length < 15;

      if (isNoise) return NextResponse.json({ status: 'ignored' });

      // 4. Match repo to project context
      const { data: projects } = await supabase
        .from('projects_portfolio')
        .select('*')
        .eq('user_id', uid);

      const repoName = data.repository.name;
      const matchedProject = projects?.find((p: any) => 
        p.name.toLowerCase().includes(repoName.toLowerCase()) || 
        repoName.toLowerCase().includes(p.name.toLowerCase())
      );

      // 5. Generate AI Draft
      const { data: lastPosts } = await supabase
        .from('posts_portfolio')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(5);

      const systemPrompt = buildMasterPrompt(settings, projects || [], lastPosts || []);
      const userPrompt = `
        A new commit was detected in ${repoName}.
        Message: "${commit.message}"
        Files changed: ${commit.modified.join(', ')}
        ${matchedProject ? `Project Context: ${matchedProject.description}` : ''}
        
        Synthesize a high-resonance post about this technical milestone.
        Respond in JSON: { "linkedin": "...", "x_thread": ["..."] }
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
      }).catch(async (err) => {
        console.warn('Webhook Groq failed. Falling back to OpenRouter...');
        const orKey = process.env.OPENROUTER_API_KEY;
        if (!orKey) throw err;

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${orKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://folio.dev',
            'X-Title': 'Folio Webhook Engine',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' }
          }),
        });

        if (!res.ok) throw new Error('OpenRouter fallback failed');
        const orData = await res.json();
        return { choices: orData.choices };
      });

      const aiResult = JSON.parse(completion.choices[0].message.content || '{}');

      // 6. Save Draft & Create Notification
      const { data: savedPost } = await supabase
        .from('posts_portfolio')
        .insert({
          user_id: uid,
          content_linkedin: aiResult.linkedin,
          content_x: aiResult.x_thread,
          tone: 'builder',
          project_id: matchedProject?.id || null,
          is_saved: false
        })
        .select()
        .single();

      await supabase.from('notifications_portfolio').insert({
        user_id: uid,
        type: 'commit',
        message: `⌥ New commit detected: "${commit.message}"\nI've drafted a post for you.`,
        cta_label: 'View Draft',
        cta_action: `/generate?input=${encodeURIComponent(commit.message)}`,
        is_read: false
      });

      return NextResponse.json({ status: 'success', postId: savedPost?.id });
    }

    return NextResponse.json({ status: 'no_commits' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
