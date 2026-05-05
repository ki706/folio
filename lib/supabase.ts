import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side singleton for browser components
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Legacy client if needed for simple scripts
export const supabaseOld = createClient(supabaseUrl, supabaseAnonKey);
