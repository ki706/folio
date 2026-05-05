// lib/logic/resonance.ts
import { Project, Post } from '../types';
import { getProjects } from '../api/projects';
import { getPosts } from '../api/posts';

export async function calculateResonanceScore(
  providedData?: { streak?: number; projects?: Project[]; posts?: Post[] }
): Promise<number> {
  try {
    const streak = providedData?.streak ?? await getPostingStreak();
    const projects = providedData?.projects ?? await getProjects();
    const posts = providedData?.posts ?? await getPosts();

    const savedPosts = posts.filter(p => p.is_saved);
    const projectDepth = projects.length * 10;
    const velocity = savedPosts.length * 2;
    const consistency = streak * 5;

    return Math.min(Math.round(projectDepth + velocity + consistency), 100);
  } catch (err) {
    console.error('calculateResonanceScore Exception:', err);
    return 0;
  }
}

export async function getPostingStreak(providedPosts?: Post[]): Promise<number> {
  try {
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
  } catch (err) {
    console.error('getPostingStreak Exception:', err);
    return 0;
  }
}

export async function getWeekActivity(): Promise<boolean[]> {
  try {
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
  } catch (err) {
    console.error('getWeekActivity Exception:', err);
    return [false, false, false, false, false, false, false];
  }
}

export async function getDaysSinceLastPost(): Promise<number | null> {
  try {
    const posts = await getPosts();
    const saved = posts.filter(p => p.is_saved);
    if (saved.length === 0) return null;
    
    const last = new Date(saved[0].created_at);
    const diff = Date.now() - last.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch (err) {
    console.error('getDaysSinceLastPost Exception:', err);
    return null;
  }
}
