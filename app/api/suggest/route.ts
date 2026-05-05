import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { projects, settings, recentPosts } = await req.json();

    const hasData = (projects && projects.length > 0) || (recentPosts && recentPosts.length > 0);

    const prompt = `
      You are Folio's Strategy Engine. Suggest 3 high-resonance content "hooks" for a technical founder.
      
      USER CONTEXT:
      Title: ${settings?.title || 'Technical Founder'}
      Stack: ${settings?.stack?.join(', ') || 'Modern Web'}
      Goal: ${settings?.goal || 'Build personal brand'}
      
      ${hasData ? `
        PROJECTS:
        ${projects.map((p: any) => `- ${p.name}: ${p.description}`).join('\n')}
        
        RECENT THEMES:
        ${recentPosts.map((p: any) => p.content_linkedin.slice(0, 50)).join('\n')}
      ` : `
        NO HISTORY YET: Provide high-level industry bootstrap hooks for a ${settings?.title || 'developer'} 
        focusing on shipping quality and technical depth.
      `}

      FORMAT: Return JSON only.
      {
        "suggestions": ["Hook 1", "Hook 2", "Hook 3"]
      }

      RULES:
      - Max 15 words per hook.
      - Make them sound like a "Perfect Founder": confident, direct, and slightly provocative.
      - Never use "Here is a post about...".
      - Example: "Most teams over-engineer their auth. Here is how we shipped in 2 hours."
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const data = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Fallback if AI fails or returns empty
    const suggestions = data.suggestions || [
      "The hidden cost of technical debt in early-stage startups.",
      "Why I chose my current stack for 2026.",
      "How to maintain shipping velocity while building solo."
    ];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggest API Error:', error);
    return NextResponse.json({ 
      suggestions: [
        "The shift from builder to founder mindset.",
        "Shipping as the ultimate competitive advantage.",
        "Why clean code is a distraction for pre-PMF startups."
      ] 
    }, { status: 200 });
  }
}
