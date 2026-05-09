import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single browser-side singleton — do NOT create multiple instances
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your main domain in Vercel (e.g. folio-post.vercel.app)
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel for preview branches
    'http://localhost:3000/';
  
  // Ensure it starts with https:// for Vercel URLs
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure it ends with a slash
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};
