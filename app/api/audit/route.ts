import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isDemo = cookieStore.get('emitto_demo_mode')?.value === 'true';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check settings directly
    let settings = null;
    let settingsError = null;
    if (user) {
      const { data, error } = await supabase
        .from('EmittoSettings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      settings = data;
      settingsError = error;
    }

    return NextResponse.json({
      isDemo,
      authenticated: !!user,
      userId: user?.id || null,
      userEmail: user?.email || null,
      hasSettings: !!settings,
      hasToken: !!settings?.github_token,
      settingsError: settingsError ? {
        code: settingsError.code,
        message: settingsError.message
      } : null,
      cookies: cookieStore.getAll().map(c => c.name)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
