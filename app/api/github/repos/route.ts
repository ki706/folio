import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/store';

export async function GET() {
  try {
    const settings = await getSettings();
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
