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

export async function getSettings(customClient?: any): Promise<Settings | null> {
  try {
    const client = customClient || supabase;
    
    // Check demo mode FIRST
    if (await isDemoMode()) {
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

    const userRes = await client.auth.getUser();
    const user = userRes.data?.user;
    
    if (!user) {
      console.warn('getSettings: No user session detected.');
      return null;
    }

    console.log('getSettings: Fetching settings for user:', user.id);

    const { data, error } = await client
      .from('EmittoSettings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('getSettings: Supabase error:', {
        code: error.code,
        message: error.message,
        userId: user.id
      });
      // If row not found (PGRST116), return defaults
      if (error.code === 'PGRST116') {
        console.log('getSettings: No settings row found, returning defaults.');
        return DEFAULT_SETTINGS(user.id) as Settings;
      }
      return null;
    }
    
    if (!data) {
      console.warn('getSettings: No data returned for user:', user.id);
      return DEFAULT_SETTINGS(user.id) as Settings;
    }

    console.log('getSettings: Successfully retrieved token status:', !!data.github_token);
    return data;
  } catch (err) {
    console.error('getSettings Exception:', err);
    return null;
  }
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  if (await isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) throw new Error('Identity verification required.');
  
  // Check existence first to avoid upsert edge cases with RLS
  const { data: existing } = await supabase
    .from('EmittoSettings')
    .select('id')
    .eq('user_id', user.id)
    .single();

  let result;
  if (existing) {
    result = await supabase
      .from('EmittoSettings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  } else {
    result = await supabase
      .from('EmittoSettings')
      .insert({ ...settings, user_id: user.id });
  }

  if (result.error) {
    console.error('Save Settings Error Details:', {
      code: result.error.code,
      message: result.error.message,
      userId: user.id
    });
    throw new Error(`Signal synchronization interrupted: ${result.error.message}`);
  }
  console.log('Settings successfully synchronized for user:', user.id);
}
