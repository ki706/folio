import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { repoFullName } = await req.json();
    const settings = await getSettings();
    const origin = new URL(req.url).origin;

    if (!settings || !settings.github_token) {
      return NextResponse.json({ error: 'GitHub token not found.' }, { status: 401 });
    }

    const webhookUrl = `${origin}/api/github/webhook?uid=${settings.user_id}`;

    // Register webhook via GitHub API
    const res = await fetch(`https://api.github.com/repos/${repoFullName}/hooks`, {
      method: 'POST',
      headers: {
        Authorization: `token ${settings.github_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['push'],
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: settings.webhook_secret,
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to register webhook.');
    }

    // Add to tracked repos if not already there
    const currentTracked = settings.tracked_repos || [];
    if (!currentTracked.includes(repoFullName)) {
      await saveSettings({
        tracked_repos: [...currentTracked, repoFullName]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
