// lib/api/projects.ts
import { supabase } from '../supabase';
import { Project } from '../types';
import { isDemoMode, getCurrentUser } from '../auth-helpers';

export async function getProjects(): Promise<Project[]> {
  try {
    if (await isDemoMode()) {
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

    const { data, error } = await supabase
      .from('projects_portfolio')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('getProjects Error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getProjects Exception:', err);
    return [];
  }
}

export async function saveProject(project: Partial<Project>): Promise<void> {
  try {
    if (await isDemoMode()) return;
    const user = await getCurrentUser();
    if (!user) return;
    
    const { id, ...rest } = project;
    let result;
    if (id) {
      result = await supabase.from('projects_portfolio').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id);
    } else {
      result = await supabase.from('projects_portfolio').insert({ ...rest, user_id: user.id });
    }
    if (result.error) console.error('Save Project Error:', result.error);
  } catch (err) {
    console.error('saveProject Exception:', err);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    if (await isDemoMode()) return;
    const user = await getCurrentUser();
    if (!user) return;
    const { error } = await supabase.from('projects_portfolio').delete().eq('id', id).eq('user_id', user.id);
    if (error) console.error('Delete Project Error:', error);
  } catch (err) {
    console.error('deleteProject Exception:', err);
  }
}
