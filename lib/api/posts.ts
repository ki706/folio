// lib/api/posts.ts
import { supabase } from '../supabase';
import { Post } from '../types';
import { isDemoMode, getCurrentUser } from '../auth-helpers';

export async function getPosts(): Promise<Post[]> {
  try {
    if (await isDemoMode()) {
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

    const { data, error } = await supabase
      .from('posts_portfolio')
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

export async function savePost(post: Partial<Post>): Promise<void> {
  if (await isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { id, ...rest } = post;
  let result;
  if (id) {
    result = await supabase.from('posts_portfolio').upsert({ id, ...rest, user_id: user.id });
  } else {
    result = await supabase.from('posts_portfolio').insert({ ...rest, user_id: user.id });
  }
  if (result.error) {
    console.error('Save Post Error:', result.error);
    throw new Error(result.error.message);
  }
}

export async function deletePost(id: string): Promise<void> {
  if (await isDemoMode()) return;
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  
  const { error } = await supabase.from('posts_portfolio').delete().eq('id', id).eq('user_id', user.id);
  if (error) {
    console.error('Delete Post Error:', error);
    throw new Error(error.message);
  }
}
