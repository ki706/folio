// lib/auth-helpers.ts
import { supabase } from './supabase';

export async function isDemoMode() {
  const allowDemo = process.env.NEXT_PUBLIC_ALLOW_DEMO === 'true';
  if (!allowDemo) return false;

  if (typeof window !== 'undefined') {
    return localStorage.getItem('emitto_demo_mode') === 'true' || document.cookie.includes('emitto_demo_mode=true');
  }
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('emitto_demo_mode')?.value === 'true';
  } catch {
    return false;
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
