import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single browser-side singleton — do NOT create multiple instances
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
