import { NextResponse } from 'next/server';
import { generateNonce } from '@/lib/auth/verify-signature';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    const nonce = generateNonce();
    
    // Store nonce in Redis with 5 minute expiration
    if (redis) {
      await redis.setex(`nonce:pending:${nonce}`, 300, '1');
    }
    
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Nonce generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}

