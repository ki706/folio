import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import LandingPage from './landing/page';
import DashboardPage from './dashboard/page'; // We'll move the old home to here

export default async function Page() {
  const cookieStore = await cookies();

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
  const isDemo = (await cookies()).get('emitto_demo_mode')?.value === 'true';

  if (!user && !isDemo) {
    return <LandingPage />;
  }

  return <DashboardPage />;
}
