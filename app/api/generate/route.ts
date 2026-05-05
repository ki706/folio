import { NextRequest, NextResponse } from 'next/server';
import { buildMasterPrompt } from '@/lib/ai/prompt';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isDemo = (await cookies()).get('folio_demo_mode')?.value === 'true';

    if (!user && !isDemo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { input, tone, projectId } = body as {
      input: string;
      tone: string;
      projectId: string | null;
    };

    if (!input?.trim()) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    // Fetch data server-side for security
    let settings, projects, recentPosts;
    const uid = user?.id || 'demo-user-uuid';

    if (isDemo || uid === 'demo-user-uuid') {
       // Mock data for demo
       settings = {
         name: 'Demo Account',
         title: 'Full Stack Architect',
         years_exp: '8',
         location: 'Global',
         goal: 'both',
         stack: ['Next.js', 'Supabase', 'TypeScript'],
         voice_description: 'Strategic, technical, and slightly provocative.',
         writing_samples: []
       } as any;
       projects = [{ id: '1', name: 'Folio Demo', description: 'AI Content Engine', stack: ['Next.js'], status: 'active', achievement: 'Demo', learned: 'Demo' }] as any;
       recentPosts = [] as any;
    } else {
      const [sRes, pRes, rRes] = await Promise.all([
        supabase.from('settings_portfolio').select('*').eq('user_id', uid).single(),
        supabase.from('projects_portfolio').select('*').eq('user_id', uid),
        supabase.from('posts_portfolio').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5)
      ]);
      settings = sRes.data;
      projects = pRes.data || [];
      recentPosts = rRes.data || [];
    }

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    const systemPrompt = buildMasterPrompt(settings, projects, recentPosts);
    const selectedProject = projectId ? projects.find((p: any) => p.id === projectId) : null;
    const userMessage = `${input.trim()}${selectedProject ? ` [Context: ${selectedProject.name}]` : ''} [Tone: ${tone}]`;

    let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.8,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const groqError = await response.text();
      console.warn('Groq Cluster Limited:', groqError);
      console.warn('Pivoting to OpenRouter fallback...');
      
      const orKey = process.env.OPENROUTER_API_KEY;
      if (orKey) {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${orKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://folio.dev',
            'X-Title': 'Folio Broadcast Engine',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
          }),
        });
      }
    }

    if (!response.ok) {
      const finalErr = await response.text();
      console.error('AI Cluster failure (Final):', finalErr);
      return NextResponse.json({ error: 'AI synthesis nodes are currently unresponsive. Please check network sync.' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    const parsed = JSON.parse(content);
    return NextResponse.json({
      linkedin: parsed.linkedin,
      x_thread: parsed.x_thread,
    });
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
