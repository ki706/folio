// app/api/trending/route.ts
import { NextResponse } from 'next/server';

interface HNStory {
  title?: string;
  url?: string;
}

export async function GET() {
  try {
    // Fetch HN top stories
    const hnResponse = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { next: { revalidate: 3600 } }
    );
    const storyIds: number[] = await hnResponse.json();
    const top10 = storyIds.slice(0, 10);

    const storyPromises = top10.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) =>
        r.json()
      )
    );
    const stories: HNStory[] = await Promise.all(storyPromises);
    const hnTitles = stories
      .filter((s) => s?.title)
      .map((s) => s.title as string);

    // Fetch Reddit r/artificial
    let redditTitles: string[] = [];
    try {
      const redditResponse = await fetch(
        'https://www.reddit.com/r/artificial/top.json?limit=5&t=day',
        {
          headers: { 'User-Agent': 'Emitto/1.0' },
          next: { revalidate: 3600 },
        }
      );
      const redditData = await redditResponse.json();
      redditTitles = redditData?.data?.children
        ?.map((c: { data: { title: string } }) => c.data.title)
        .slice(0, 5) || [];
    } catch {
      // Reddit can fail — that's fine
    }

    const allTopics = [...hnTitles, ...redditTitles];

    return NextResponse.json({ topics: allTopics });
  } catch (err) {
    console.error('Trending fetch error:', err);
    return NextResponse.json({ topics: [] });
  }
}
