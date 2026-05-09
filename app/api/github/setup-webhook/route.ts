import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { repoFullName } = await req.json();
    const cookieStore = await cookies();
    const isDemo = cookieStore.get('emitto_demo_mode')?.value === 'true';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (isDemo || user?.email === 'demo@emitto.dev') {
      return NextResponse.json({ success: true, demo: true });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from('EmittoSettings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings || !settings.github_token) {
      return NextResponse.json({ error: 'GitHub token not found. Please connect your account in Settings.' }, { status: 401 });
    }

    const origin = new URL(req.url).origin;
    const webhookUrl = `${origin}/api/github/webhook?uid=${user.id}`;

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
      await supabase
        .from('EmittoSettings')
        .update({
          tracked_repos: [...currentTracked, repoFullName]
        })
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
