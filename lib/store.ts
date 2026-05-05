// lib/store.ts
import { supabase } from './supabase';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  stack: string[];
  status: 'active' | 'completed' | 'paused';
  learned: string;
  achievement: string;
  draft_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content_linkedin: string;
  content_x: string[];
  tone: 'builder' | 'hustler' | 'hot_take';
  project_id: string | null;
  project_name: string | null;
  is_saved: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'inactivity' | 'trending' | 'new_project' | 'streak';
  message: string;
  cta_label: string;
  cta_action: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  name: string;
  title: string;
  years_exp: string;
  location: string;
  goal: 'hired' | 'freelance' | 'both';
  voice_description: string;
  writing_samples: string[];
  stack: string[];
  linkedin_url: string;
  x_handle: string;
  github_url: string;
  github_token: string;
  tracked_repos: string[];
  webhook_secret: string;
  inactivity_days: number;
  proactive_trending: boolean;
  proactive_new_project: boolean;
  proactive_inactivity: boolean;
  onboarding_completed: boolean;
}

const DEFAULT_SETTINGS = (userId: string): Partial<Settings> => ({
  user_id: userId,
  name: 'New Builder',
  title: 'Technical Founder',
  years_exp: '0',
  location: 'Global',
  goal: 'both',
  voice_description: 'Direct, technical, and high-resonance.',
  writing_samples: [],
  stack: [],
  linkedin_url: '',
  x_handle: '',
  github_url: '',
  github_token: '',
  tracked_repos: [],
  webhook_secret: Math.random().toString(36).slice(2),
  inactivity_days: 3,
  proactive_trending: true,
  proactive_new_project: true,
  proactive_inactivity: true,
  onboarding_completed: false,
});

// --- AUTH HELPERS ---
export function isDemoMode() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('folio_demo_mode') === 'true' || document.cookie.includes('folio_demo_mode=true');
  }
  // For server-side, we'll rely on the cookie which is handled by the middleware 
  // or can be checked in specific server-side functions.
  return false;
}

export async function getCurrentUser() {
  if (isDemoMode()) return { id: 'demo-user-uuid', email: 'demo@folio.dev' } as any;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// --- SETTINGS ---
export async function getSettings(): Promise<Settings | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  if (isDemoMode() || user.id === 'demo-user-uuid') {
    return {
      ...DEFAULT_SETTINGS('demo-user-uuid'),
      name: 'Kidus Ismail',
      title: 'Full Stack Architect',
      years_exp: '8',
      location: 'Addis Ababa',
      goal: 'both',
      stack: ['Next.js', 'Supabase', 'TypeScript', 'AI Agents'],
      voice_description: 'Strategic, technical, and slightly provocative.',
      writing_samples: ['Sample 1', 'Sample 2'],
      github_url: 'https://github.com/folio-demo',
      github_token: 'demo-token',
      tracked_repos: ['folio-broadcast-engine'],
      webhook_secret: 'demo-secret'
    } as Settings;
  }

  const { data, error } = await supabase
    .from('settings_portfolio')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    const newSettings = DEFAULT_SETTINGS(user.id);
    const { data: created, error: createError } = await supabase
      .from('settings_portfolio')
      .upsert(newSettings)
      .select()
      .single();
    
    if (createError) {
      console.error('Settings Init Error:', createError);
      return null;
    }
    return created;
  }
  return data;
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  if (isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) return;
  await supabase.from('settings_portfolio').upsert({ ...settings, user_id: user.id });
}

// --- PROJECTS ---
export async function getProjects(): Promise<Project[]> {
  if (isDemoMode()) {
    return [
      {
        id: '1', name: 'Folio Engine', status: 'active', stack: ['Next.js', 'AI'], 
        description: 'Autonomous content synthesis engine for developers.',
        learned: 'Scaling LLM context windows efficiently.', achievement: '1.2k Stars on GitHub',
        user_id: 'demo', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_generated: true
      },
      {
        id: '2', name: 'Supabase SSR', status: 'completed', stack: ['Postgres', 'Auth'],
        description: 'Global session persistence layer for App Router.',
        learned: 'Edge-function latency optimization.', achievement: 'Zero downtime migration',
        user_id: 'demo', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), updated_at: new Date().toISOString(), draft_generated: false
      }
    ] as any[];
  }
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from('projects_portfolio')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function saveProject(project: Partial<Project>): Promise<void> {
  if (isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) return;
  
  const { id, ...rest } = project;
  if (id) {
    await supabase.from('projects_portfolio').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id);
  } else {
    await supabase.from('projects_portfolio').insert({ ...rest, user_id: user.id });
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) return;
  await supabase.from('projects_portfolio').delete().eq('id', id).eq('user_id', user.id);
}

// --- POSTS ---
export async function getPosts(): Promise<Post[]> {
  if (isDemoMode()) {
    return [
      {
        id: '1', user_id: 'demo', content_linkedin: 'Most teams over-engineer their auth. We shipped in 2 hours.',
        content_x: ['1/ Thread on shipping fast.', '2/ Focus on core ROI.'], tone: 'builder',
        project_name: 'Folio Engine', is_saved: true, created_at: new Date().toISOString()
      },
      {
        id: '2', user_id: 'demo', content_linkedin: 'Clean code is a distraction for pre-PMF startups.',
        content_x: ['Ship first.', 'Polish later.'], tone: 'hot_take',
        project_name: 'Supabase SSR', is_saved: true, created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ] as any[];
  }
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from('posts_portfolio')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function savePost(post: Partial<Post>): Promise<void> {
  if (isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) return;

  const { id, ...rest } = post;
  if (id) {
    await supabase.from('posts_portfolio').upsert({ id, ...rest, user_id: user.id });
  } else {
    await supabase.from('posts_portfolio').insert({ ...rest, user_id: user.id });
  }
}

export async function deletePost(id: string): Promise<void> {
  if (isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) return;
  await supabase.from('posts_portfolio').delete().eq('id', id).eq('user_id', user.id);
}

// --- NOTIFICATIONS ---
export async function getNotifications(): Promise<Notification[]> {
  if (isDemoMode()) {
    return [
      {
        id: '1', type: 'streak', message: '🔥 12-day posting streak! Your brand signal is reaching peak resonance.',
        cta_label: 'View Stats', cta_action: '/', is_read: false, created_at: new Date().toISOString()
      },
      {
        id: '2', type: 'trending', message: '⌥ New trend detected: "AI Agents". Ready to synthesize a perspective?',
        cta_label: 'Draft Post', cta_action: '/generate', is_read: false, created_at: new Date().toISOString()
      }
    ] as any[];
  }
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from('notifications_portfolio')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function addNotification(n: Omit<Notification, 'id' | 'created_at' | 'user_id'>): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await supabase.from('notifications_portfolio').insert([{ ...n, user_id: user.id }]);
}

export async function markNotificationRead(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await supabase.from('notifications_portfolio').update({ is_read: true }).eq('id', id).eq('user_id', user.id);
}

export async function dismissNotification(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await supabase.from('notifications_portfolio').delete().eq('id', id).eq('user_id', user.id);
}

// --- RESONANCE ENGINE ---
export async function calculateResonanceScore(
  providedData?: { streak?: number; projects?: Project[]; posts?: Post[] }
): Promise<number> {
  const streak = providedData?.streak ?? await getPostingStreak();
  const projects = providedData?.projects ?? await getProjects();
  const posts = providedData?.posts ?? await getPosts();

  const savedPosts = posts.filter(p => p.is_saved);
  const projectDepth = projects.length * 10;
  const velocity = savedPosts.length * 2;
  const consistency = streak * 5;

  return Math.min(Math.round(projectDepth + velocity + consistency), 100);
}

export async function getPostingStreak(providedPosts?: Post[]): Promise<number> {
  const posts = providedPosts ?? await getPosts();
  const saved = posts.filter(p => p.is_saved);
  if (saved.length === 0) return 0;
  
  const postDays = new Set(saved.map(p => new Date(p.created_at).toDateString()));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (postDays.has(d.toDateString())) streak++;
    else break;
  }
  return streak;
}

export async function getWeekActivity(): Promise<boolean[]> {
  const posts = await getPosts();
  const saved = posts.filter(p => p.is_saved);
  
  const postDays = new Set(saved.map(p => new Date(p.created_at).toDateString()));
  const result: boolean[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    result.push(postDays.has(d.toDateString()));
  }
  return result;
}

export async function getDaysSinceLastPost(): Promise<number | null> {
  const posts = await getPosts();
  const saved = posts.filter(p => p.is_saved);
  if (saved.length === 0) return null;
  
  const last = new Date(saved[0].created_at);
  const diff = Date.now() - last.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
