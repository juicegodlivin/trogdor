import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function createContext() {
  const session = await auth();
  
  return {
    db,
    redis: redis || null,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

