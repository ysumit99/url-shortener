import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';
import { Ratelimit } from '@upstash/ratelimit';

// Create a rate limiter: allows 5 requests per 10 seconds per IP
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function POST(request: Request) {
  try {
    // Get client IP (Vercel forwards this in the headers)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Check rate limit
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }
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