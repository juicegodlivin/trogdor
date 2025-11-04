import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { headers } from 'next/headers';

export async function createContext() {
  const session = await auth();
  const headersList = headers();
  
  // Get IP address for rate limiting
  const ip = 
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';
  
  return {
    db,
    redis: redis || null,
    session,
    ip,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

