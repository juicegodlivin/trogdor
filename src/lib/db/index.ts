import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const connectionString = process.env.DATABASE_URL;

// For migrations
export const migrationClient = postgres(connectionString, { 
  max: 1,
});

// For queries - Serverless-optimized configuration
// Works with Supabase Transaction Pooler (port 6543)
const queryClient = postgres(connectionString, {
  prepare: false, // Required for pgBouncer/Supavisor transaction pooler
  max: 1, // Serverless functions should use 1 connection per instance
  idle_timeout: 20,
  max_lifetime: 60 * 30, // 30 minutes
});

export const db = drizzle(queryClient, { schema });

