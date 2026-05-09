// lib/api/projects.ts
import { supabase as browserClient } from '../supabase';
import { Project } from '../types';
import { isDemoMode, getCurrentUser } from '../auth-helpers';

export async function getProjects(customClient?: any): Promise<Project[]> {
  try {
    const client = customClient || browserClient;
    
    if (await isDemoMode()) {
      return [
        {
          id: '1', name: 'Emitto Engine', status: 'active', stack: ['Next.js', 'AI'],
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
    
    const { data: { user } } = await client.auth.getUser();
    if (!user) return [];

    const { data, error } = await client
      .from('EmittoProjects')
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

export async function saveProject(project: Partial<Project>, customClient?: any): Promise<void> {
  if (await isDemoMode()) return;
  const client = customClient || browserClient;
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Identity verification required.');

  const { id, ...rest } = project;
  let result;
  if (id) {
    result = await client.from('EmittoProjects').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id);
  } else {
    result = await client.from('EmittoProjects').insert({ ...rest, user_id: user.id });
  }
  if (result.error) {
    console.error('Save Project Error:', result.error);
    throw new Error('Project persistence failed. Check system connection.');
  }
}

export async function deleteProject(id: string, customClient?: any): Promise<void> {
  if (await isDemoMode()) return;
  const client = customClient || browserClient;
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Identity verification required.');

  const { error } = await client.from('EmittoProjects').delete().eq('id', id).eq('user_id', user.id);
  if (error) {
    console.error('Delete Project Error:', error);
    throw new Error('Erasure protocol failed.');
  }
}
