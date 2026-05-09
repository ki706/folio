// lib/api/posts.ts
import { supabase as browserClient } from '../supabase';
import { Post } from '../types';
import { isDemoMode, getCurrentUser } from '../auth-helpers';

export async function getPosts(customClient?: any): Promise<Post[]> {
  try {
    const client = customClient || browserClient;
    
    if (await isDemoMode()) {
      return [
        {
          id: '1', user_id: 'demo', content_linkedin: 'Most teams over-engineer their auth. We shipped in 2 hours.',
          content_x: ['1/ Thread on shipping fast.', '2/ Focus on core ROI.'], tone: 'builder',
          project_name: 'Emitto Engine', is_saved: true, created_at: new Date().toISOString()
        },
        {
          id: '2', user_id: 'demo', content_linkedin: 'Clean code is a distraction for pre-PMF startups.',
          content_x: ['Ship first.', 'Polish later.'], tone: 'hot_take',
          project_name: 'Supabase SSR', is_saved: true, created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'demo-draft-1', user_id: 'demo', 
          content_linkedin: 'Just analyzed the new Next.js 15 caching changes. It’s a total shift in how we handle data stability at the edge. Synthesizing a full teardown now...',
          content_x: ['1/ Next.js 15 caching is deep.'], tone: 'technical',
          project_name: 'Emitto Engine', is_saved: false, created_at: new Date().toISOString()
        },
        {
          id: 'demo-draft-2', user_id: 'demo', 
          content_linkedin: 'We just hit 99.99% reliability on our broadcast nodes by switching to a predictive layout guard. Here is why the "blink" is the enemy of premium UX...',
          content_x: ['1/ Zero-flicker architecture is the goal.'], tone: 'builder',
          project_name: 'Supabase SSR', is_saved: false, created_at: new Date().toISOString()
        }
      ] as any[];
    }
    
    const { data: { user } } = await client.auth.getUser();
    if (!user) return [];

    const { data, error } = await client
      .from('EmittoPosts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('getPosts Error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getPosts Exception:', err);
    return [];
  }
}

export async function savePost(post: Partial<Post>, customClient?: any): Promise<void> {
  if (await isDemoMode()) return;
  const client = customClient || browserClient;
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Identity verification required.');

  const { id, ...rest } = post;
  let result;
  if (id) {
    result = await client.from('EmittoPosts').upsert({ id, ...rest, user_id: user.id });
  } else {
    result = await client.from('EmittoPosts').insert({ ...rest, user_id: user.id });
  }
  if (result.error) {
    console.error('Save Post Error:', result.error);
    throw new Error('Narrative storage failure.');
  }
}

export async function deletePost(id: string, customClient?: any): Promise<void> {
  if (await isDemoMode()) return;
  const client = customClient || browserClient;
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Identity verification required.');
  
  const { error } = await client.from('EmittoPosts').delete().eq('id', id).eq('user_id', user.id);
  if (error) {
    console.error('Delete Post Error:', error);
    throw new Error('Signal erasure protocol interrupted.');
  }
}
