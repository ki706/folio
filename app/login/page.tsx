import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';
import { Suspense } from 'react';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get('emitto_demo_mode')?.value === 'true';

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user || isDemo) {
    if (isDemo) {
      redirect('/dashboard');
    }

    // Check onboarding status on server to avoid client-side jump
    const { data: settings } = await supabase
      .from('EmittoSettings')
      .select('onboarding_completed')
      .eq('user_id', user?.id)
      .single();

    if (settings && settings.onboarding_completed === false) {
      redirect('/onboarding');
    }

    redirect('/dashboard');
  }

  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.2em' }}>
        INITIALIZING CONSOLE...
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
