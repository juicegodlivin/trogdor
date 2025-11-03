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

// For queries - Supavisor (new pooler) works with default settings
const queryClient = postgres(connectionString, {
  max: 10,
});

export const db = drizzle(queryClient, { schema });

