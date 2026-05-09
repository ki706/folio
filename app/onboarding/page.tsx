import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OnboardingClient from './OnboardingClient';

export default async function OnboardingPage() {
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

  if (!user && !isDemo) {
    redirect('/login');
  }

  // Fetch initial settings on server to populate the form instantly
  const { data: settings } = await supabase
    .from('EmittoSettings')
    .select('*')
    .eq('user_id', user?.id || 'demo-user-uuid')
    .single();

  if (settings && settings.onboarding_completed) {
    redirect('/dashboard');
  }

  return <OnboardingClient initialSettings={settings || {}} />;
}

