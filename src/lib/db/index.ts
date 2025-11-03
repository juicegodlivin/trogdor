import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const connectionString = process.env.DATABASE_URL;

// Log connection info (without password)
const urlParts = connectionString.split('@');
if (urlParts.length > 1) {
  console.log('Database connecting to:', urlParts[1]);
} else {
  console.log('Database URL format seems invalid');
}

// For migrations
export const migrationClient = postgres(connectionString, { 
  max: 1,
  onnotice: () => {}, // Suppress notices
});

// For queries - Serverless-optimized configuration
// Works with Supabase Transaction Pooler (port 6543)
const queryClient = postgres(connectionString, {
  prepare: false, // Required for pgBouncer/Supavisor transaction pooler
  max: 1, // Serverless functions should use 1 connection per instance
  idle_timeout: 20,
  max_lifetime: 60 * 30, // 30 minutes
  onnotice: () => {}, // Suppress notices
  connect_timeout: 10, // 10 second connection timeout
  ssl: connectionString.includes('pooler.supabase.com') ? 'require' : false, // Force SSL for Supabase pooler
});

// Test connection on init
queryClient`SELECT 1 as test`.catch((err) => {
  console.error('Database connection test failed:', err);
  console.error('Check DATABASE_URL password and permissions');
});

export const db = drizzle(queryClient, { schema });

