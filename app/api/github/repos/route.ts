import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const isDemo = (await cookies()).get('emitto_demo_mode')?.value === 'true';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (isDemo || user?.email === 'demo@emitto.dev') {
      return NextResponse.json([
        { id: 1, name: 'emitto-broadcast-engine', full_name: 'engineer/emitto-broadcast-engine', description: 'Autonomous content synthesis engine.', language: 'TypeScript', url: '#' },
        { id: 2, name: 'supabase-ssr-layer', full_name: 'engineer/supabase-ssr-layer', description: 'Global session persistence layer.', language: 'TypeScript', url: '#' }
      ]);
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from('EmittoSettings')
      .select('github_token, user_id')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings) {
      console.error('API REPOS: Settings fetch failed:', {
        userId: user.id,
        error: settingsError
      });
      return NextResponse.json({ 
        error: 'GitHub token not found. Please ensure your account is connected in Settings.',
        details: settingsError?.message 
      }, { status: 401 });
    }

    if (!settings.github_token) {
      console.error('API REPOS: Token missing in settings for user:', user.id);
      return NextResponse.json({ error: 'GitHub token is empty in your settings.' }, { status: 401 });
    }

    const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `token ${settings.github_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) throw new Error('GitHub API rejected the token.');

    const repos = await res.json();
    return NextResponse.json(repos.map((r: any) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      language: r.language,
      url: r.html_url,
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
