import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const isDemo = (await cookies()).get('folio_demo_mode')?.value === 'true';
    if (isDemo) {
      return NextResponse.json([
        { id: 1, name: 'folio-broadcast-engine', full_name: 'engineer/folio-broadcast-engine', description: 'Autonomous content synthesis engine.', language: 'TypeScript', url: '#' },
        { id: 2, name: 'supabase-ssr-layer', full_name: 'engineer/supabase-ssr-layer', description: 'Global session persistence layer.', language: 'TypeScript', url: '#' }
      ]);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: settings } = await supabase
      .from('settings_portfolio')
      .select('github_token')
      .eq('user_id', user.id)
      .single();

    if (!settings || !settings.github_token) {
      return NextResponse.json({ error: 'GitHub token not found in settings.' }, { status: 401 });
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
