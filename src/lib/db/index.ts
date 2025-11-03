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

// Initialize database tables if they don't exist
async function initializeTables() {
  console.log('🔄 Creating database tables (IF NOT EXISTS)...');
  
  try {
    // Just create the table - IF NOT EXISTS makes this safe
    console.log('📋 Creating users table...');
    await queryClient`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address TEXT NOT NULL UNIQUE,
        username TEXT,
        twitter_handle TEXT UNIQUE,
        twitter_id TEXT UNIQUE,
        twitter_access_token TEXT,
        twitter_refresh_token TEXT,
        twitter_token_expiry TIMESTAMP,
        profile_image TEXT,
        joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
        last_active TIMESTAMP DEFAULT NOW(),
        total_offerings INTEGER DEFAULT 0 NOT NULL,
        current_rank INTEGER,
        is_verified BOOLEAN DEFAULT FALSE,
        metadata JSONB
      );
    `;
    console.log('✅ Users table ready');
    
    console.log('📋 Creating indexes...');
    await queryClient`CREATE INDEX IF NOT EXISTS wallet_idx ON users(wallet_address);`;
    await queryClient`CREATE INDEX IF NOT EXISTS twitter_id_idx ON users(twitter_id);`;
    await queryClient`CREATE INDEX IF NOT EXISTS rank_idx ON users(current_rank);`;
    console.log('✅ Indexes ready');
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    // Don't throw - allow app to start and show errors later
  }
}

// Run initialization ONLY at runtime, NOT during build
// Check if we're in a build context vs runtime context
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.NEXT_BUILD === 'true';

if (!isBuildTime) {
  console.log('🚀 Starting database initialization...');
  initializeTables().catch((err) => {
    console.error('Fatal initialization error:', err);
  });
} else {
  console.log('⏭️  Skipping database initialization during build');
}

export const db = drizzle(queryClient, { schema });

