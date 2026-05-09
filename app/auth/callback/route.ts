import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';
  
  // Robust origin detection for production
  const origin = request.headers.get('x-forwarded-proto') 
    ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}`
    : requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      const { user, provider_token } = data.session;
      
      // Auto-sync GitHub token if it exists
      if (provider_token) {
        // First check if settings exist
        const { data: existing } = await supabase
          .from('settings_portemitto')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existing) {
          // Update only GitHub specific fields
          await supabase
            .from('settings_portemitto')
            .update({ 
              github_token: provider_token,
              github_url: `https://github.com/${user.user_metadata.user_name || ''}`
            })
            .eq('user_id', user.id);
        } else {
          // New user: create full record with defaults
          await supabase
            .from('settings_portemitto')
            .insert({ 
              user_id: user.id, 
              github_token: provider_token,
              github_url: `https://github.com/${user.user_metadata.user_name || ''}`,
              name: user.user_metadata.full_name || user.user_metadata.user_name || 'Engineer',
              title: 'Technical Founder',
              voice_description: 'Direct, technical, and high-resonance.',
              goal: 'both',
              inactivity_days: 3,
              proactive_trending: true,
              proactive_new_project: true,
              proactive_inactivity: true
            });
        }
      }

      return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : '/' + next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
