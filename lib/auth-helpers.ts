// lib/auth-helpers.ts
import { supabase } from './supabase';

export async function isDemoMode() {
  // We allow demo mode if explicitly enabled OR if the user already has a demo session cookie
  const envAllow = process.env.NEXT_PUBLIC_ALLOW_DEMO === 'true';

  if (typeof window !== 'undefined') {
    const hasDemoCookie = localStorage.getItem('emitto_demo_mode') === 'true' || document.cookie.includes('emitto_demo_mode=true');
    return envAllow || hasDemoCookie;
  }
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const hasDemoCookie = cookieStore.get('emitto_demo_mode')?.value === 'true';
    return envAllow || hasDemoCookie;
  } catch {
    return envAllow;
  }
}

export async function getCurrentUser() {
  try {
    if (await isDemoMode()) return { id: 'demo-user-uuid', email: 'demo@emitto.dev' } as any;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('getCurrentUser Error:', err);
    return null;
  }
}
