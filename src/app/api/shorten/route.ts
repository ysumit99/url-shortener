// app/api/shorten/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { url, ttlSeconds } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format. Include http:// or https://' }, { status: 400 });
    }

    // Generate a 6-character unique slug
    const slug = nanoid(6);

    // If TTL is provided, set an expiration, otherwise persist indefinitely
    if (ttlSeconds && typeof ttlSeconds === 'number') {
      // Store original URL
      await redis.set(`url:${slug}`, url, { ex: ttlSeconds });
      // Initialize click count
      await redis.set(`clicks:${slug}`, 0, { ex: ttlSeconds });
    } else {
      await redis.set(`url:${slug}`, url);
      await redis.set(`clicks:${slug}`, 0);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${slug}`;

    return NextResponse.json({ slug, shortUrl, originalUrl: url }, { status: 201 });
  } catch (error) {
    console.error('Shorten API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}