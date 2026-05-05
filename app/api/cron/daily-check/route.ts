// app/api/cron/daily-check/route.ts
// Vercel Cron — runs daily at 8am
// Protected by CRON_SECRET header

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In this localStorage-based MVP, the proactive checks are done
  // client-side on the Home screen. This endpoint exists for Vercel
  // Cron compatibility and can be extended when Supabase is added.

  const results: string[] = [];

  try {
    // Fetch trending topics and return them
    const baseUrl = req.nextUrl.origin;
    const trendingRes = await fetch(`${baseUrl}/api/trending`);
    const trendingData = await trendingRes.json();
    results.push(`Trending fetched: ${trendingData.topics?.length ?? 0} topics`);
  } catch (err) {
    results.push(`Trending fetch failed: ${String(err)}`);
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    results,
  });
}
