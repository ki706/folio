// lib/api/settings.ts
import { supabase } from '../supabase';
import { Settings } from '../types';
import { isDemoMode, getCurrentUser } from '../auth-helpers';

export const DEFAULT_SETTINGS = (userId: string): Partial<Settings> => ({
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

export async function getSettings(): Promise<Settings | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    if (await isDemoMode() || user.id === 'demo-user-uuid') {
      return {
        ...DEFAULT_SETTINGS('demo-user-uuid'),
        name: 'Demo Account',
        onboarding_completed: true,
        title: 'Full Stack Architect',
        years_exp: '8',
        location: 'Addis Ababa',
        goal: 'both',
        stack: ['Next.js', 'Supabase', 'TypeScript', 'AI Agents'],
        voice_description: 'Strategic, technical, and slightly provocative.',
        writing_samples: ['Sample 1', 'Sample 2'],
        github_url: 'https://github.com/emitto-demo',
        github_token: 'demo-token',
        tracked_repos: ['emitto-broadcast-engine'],
        webhook_secret: 'demo-secret'
      } as Settings;
    }

    const { data, error } = await supabase
      .from('settings_portemitto')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      // Prevent race conditions by returning defaults in-memory
      // The row will be created when the user explicitly saves settings.
      return DEFAULT_SETTINGS(user.id) as Settings;
    }
    return data;
  } catch (err) {
    console.error('getSettings Exception:', err);
    return null;
  }
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  if (await isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  
  const { error } = await supabase.from('settings_portemitto').upsert({ ...settings, user_id: user.id });
  if (error) {
    console.error('Save Settings Error:', error);
    throw new Error(error.message);
  }
}
