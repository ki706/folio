// app/dashboard/page.tsx
import {
  getSettings,
  getNotifications,
  getProjects,
  getPosts,
  getWeekActivity,
  getPostingStreak,
  getDaysSinceLastPost,
  calculateResonanceScore,
} from '@/lib/store';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const settings = await getSettings(supabase);
  
  if (!settings) {
    redirect('/login');
  }

  if (settings.onboarding_completed === false) {
    redirect('/onboarding');
  }

  // Fetch all data on the server
  const [allNotifs, allProjects, allPosts, week, daysSince] = await Promise.all([
    getNotifications(),
    getProjects(),
    getPosts(),
    getWeekActivity(),
    getDaysSinceLastPost(),
  ]);

  const currentStreak = await getPostingStreak(allPosts);
  const score = await calculateResonanceScore({ 
    streak: currentStreak, 
    projects: allProjects, 
    posts: allPosts 
  });

  return (
    <DashboardClient
      initialSettings={settings}
      initialNotifications={allNotifs.filter((n) => !n.is_read).slice(0, 4)}
      initialProjects={allProjects}
      initialPosts={allPosts}
      initialWeekActivity={week}
      initialStreak={currentStreak}
      initialResonanceScore={score}
      initialDaysSinceLastPost={daysSince}
    />
  );
}
