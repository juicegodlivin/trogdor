import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Supabase pooler requires prepare: false
const connectionString = process.env.DATABASE_URL;

// For migrations
export const migrationClient = postgres(connectionString, { 
  max: 1,
  prepare: false, // Required for Supabase transaction pooler
});

// For queries
const queryClient = postgres(connectionString, {
  prepare: false, // Required for Supabase transaction pooler
});

export const db = drizzle(queryClient, { schema });

