import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LandingPage from '@/components/landing/LandingPage';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = params.code as string | undefined;

  // If we land on the home page with an OAuth code (e.g. Supabase default fallback),
  // immediately forward it to the callback handler to exchange it for a session.
  if (code) {
    redirect(`/auth/callback?code=${code}`);
  }

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
  const isDemo = cookieStore.get('emitto_demo_mode')?.value === 'true';

  if (user || isDemo) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
