// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
  }

  try {
    const originalUrl = await redis.get<string>(`url:${slug}`);
    
    if (!originalUrl) {
      return NextResponse.json({ error: 'Short link not found or expired' }, { status: 404 });
    }

    const clicks = await redis.get<number>(`clicks:${slug}`);

    return NextResponse.json({
      slug,
      originalUrl,
      clicks: clicks || 0,
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}