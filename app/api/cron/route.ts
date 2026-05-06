import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vercel Cron will hit this endpoint daily.
export const maxDuration = 60;

// Uses a service role key to bypass RLS since this is an automated cron job.
// In a real app, you would use a SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
// For this portfolio demo, we will use the Anon Key but assume RLS is open for inserting notifications.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    // Basic authorization to prevent public abuse
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch users who have proactive_trending enabled
    const { data: users, error } = await supabase
      .from('settings_portfolio')
      .select('user_id, proactive_trending, proactive_inactivity, inactivity_days');

    if (error || !users) {
      throw new Error('Failed to fetch settings');
    }

    const notificationsToInsert = [];

    // Simulate checking inactivity and trending
    for (const user of users) {
      if (user.proactive_trending) {
        notificationsToInsert.push({
          user_id: user.user_id,
          type: 'trending',
          message: '🔥 "Next.js 15 Server Actions" is trending. Want me to draft a take based on your recent commits?',
          cta_label: 'Draft Post',
          cta_action: '/generate?input=Next.js%2015%20Server%20Actions',
          is_read: false
        });
      }

      if (user.proactive_inactivity) {
        notificationsToInsert.push({
          user_id: user.user_id,
          type: 'alert',
          message: `You haven't posted in ${user.inactivity_days} days. Keep your streak alive!`,
          cta_label: 'View Prompts',
          cta_action: '/generate',
          is_read: false
        });
      }
    }

    if (notificationsToInsert.length > 0) {
      await supabase.from('notifications_portfolio').insert(notificationsToInsert);
    }

    return NextResponse.json({ 
      status: 'success', 
      processed: users.length, 
      notificationsCreated: notificationsToInsert.length 
    });
  } catch (error: any) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
