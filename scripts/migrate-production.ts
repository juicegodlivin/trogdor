#!/usr/bin/env tsx
/**
 * Production Migration Script
 * Run this to push schema to production database
 * Usage: tsx scripts/migrate-production.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../src/lib/db/schema';

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log('🔄 Connecting to production database...');
  console.log('📍 Host:', DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown');

  const connection = postgres(DATABASE_URL, {
    max: 1,
    ssl: 'require',
    prepare: false,
  });

  const db = drizzle(connection, { schema });

  try {
    // Test connection first
    console.log('🧪 Testing connection...');
    await connection`SELECT 1 as test`;
    console.log('✅ Connection successful');

    // Create tables directly from schema
    console.log('📝 Creating tables...');
    
    // Users table
    await connection`
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
    console.log('✅ Users table created');

    // Create indexes
    await connection`CREATE INDEX IF NOT EXISTS wallet_idx ON users(wallet_address);`;
    await connection`CREATE INDEX IF NOT EXISTS twitter_id_idx ON users(twitter_id);`;
    await connection`CREATE INDEX IF NOT EXISTS rank_idx ON users(current_rank);`;
    console.log('✅ Indexes created');

    // Twitter mentions table
    await connection`
      CREATE TABLE IF NOT EXISTS twitter_mentions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tweet_id TEXT NOT NULL UNIQUE,
        user_id UUID NOT NULL REFERENCES users(id),
        tweet_url TEXT NOT NULL,
        content TEXT NOT NULL,
        has_image BOOLEAN DEFAULT FALSE,
        has_video BOOLEAN DEFAULT FALSE,
        likes INTEGER DEFAULT 0,
        retweets INTEGER DEFAULT 0,
        replies INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        quality_score INTEGER NOT NULL,
        points_awarded INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
        processed_at TIMESTAMP DEFAULT NOW(),
        is_verified BOOLEAN DEFAULT TRUE,
        metadata JSONB
      );
    `;
    console.log('✅ Twitter mentions table created');

    // Generated images table
    await connection`
      CREATE TABLE IF NOT EXISTS generated_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        prompt TEXT NOT NULL,
        image_url TEXT NOT NULL,
        replicate_id TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        downloads INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        metadata JSONB
      );
    `;
    console.log('✅ Generated images table created');

    // Leaderboard snapshots table
    await connection`
      CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        rank INTEGER NOT NULL,
        total_points INTEGER NOT NULL,
        total_mentions INTEGER NOT NULL,
        average_quality INTEGER NOT NULL,
        period TEXT NOT NULL,
        period_start TIMESTAMP NOT NULL,
        period_end TIMESTAMP NOT NULL,
        snapshot_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✅ Leaderboard snapshots table created');

    // Webhook events table
    await connection`
      CREATE TABLE IF NOT EXISTS webhook_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        webhook_id TEXT NOT NULL UNIQUE,
        source TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload JSONB NOT NULL,
        processed BOOLEAN DEFAULT FALSE,
        processed_at TIMESTAMP,
        received_at TIMESTAMP DEFAULT NOW() NOT NULL,
        retry_count INTEGER DEFAULT 0,
        error TEXT
      );
    `;
    console.log('✅ Webhook events table created');

    // Payouts table
    await connection`
      CREATE TABLE IF NOT EXISTS payouts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        amount INTEGER NOT NULL,
        rank INTEGER NOT NULL,
        period TEXT NOT NULL,
        period_start TIMESTAMP NOT NULL,
        period_end TIMESTAMP NOT NULL,
        transaction_hash TEXT,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        processed_at TIMESTAMP
      );
    `;
    console.log('✅ Payouts table created');

    console.log('🎉 All tables created successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();

