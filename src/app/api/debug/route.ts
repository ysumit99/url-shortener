import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  // 🛑 FAIL-SAFE: Immediately block access if running in production
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const urlKeys = await redis.keys('url:*');
    const clickKeys = await redis.keys('clicks:*');

    const sampleData: Record<string, any> = {};
    for (const key of urlKeys.slice(0, 5)) {
      sampleData[key] = await redis.get(key);
    }

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      totalUrlKeys: urlKeys.length,
      totalClickKeys: clickKeys.length,
      sampleValues: sampleData
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect' }, { status: 500 });
  }
}