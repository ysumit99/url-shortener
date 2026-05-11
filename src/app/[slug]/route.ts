// app/[slug]/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Await params to adhere to Next.js async route parameters standard
  const { slug } = await params;

  try {
    // Lookup the long URL in Redis
    const originalUrl = await redis.get<string>(`url:${slug}`);

    if (!originalUrl) {
      return new NextResponse('URL not found or has expired', { status: 404 });
    }

    // Atomically increment the click counter (O(1) operation)
    await redis.incr(`clicks:${slug}`);

    // Redirect the user
    return NextResponse.redirect(originalUrl, 301);
  } catch (error) {
    console.error('Redirection Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}