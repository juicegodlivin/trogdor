#!/usr/bin/env tsx
/**
 * Verifies all required database tables exist
 * Run before launch to ensure database is ready
 */

require('dotenv').config({ path: '.env.local' });

import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function verifyTables() {
  console.log('🔍 Verifying database tables...\n');

  const requiredTables = [
    'users',
    'twitter_mentions',
    'leaderboard_snapshots',
    'generated_images',
    'webhook_events',
    'payouts',
  ];

  try {
    // Query all tables in the database
    const result = await db.execute(sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    const existingTables = (result as any[]).map((r: any) => r.tablename);

    console.log('📋 Existing tables:');
    existingTables.forEach((table) => {
      console.log(`   ✅ ${table}`);
    });
    console.log('');

    // Check for missing tables
    const missingTables = requiredTables.filter(
      (table) => !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
      console.log('❌ Missing tables:');
      missingTables.forEach((table) => {
        console.log(`   ⚠️  ${table}`);
      });
      console.log('');
      console.log('🔧 To create missing tables, run:');
      console.log('   npm run db:push');
      console.log('');
      process.exit(1);
    } else {
      console.log('✅ All required tables exist!');
      console.log('');
      
      // Count records in each table
      console.log('📊 Record counts:');
      for (const table of requiredTables) {
        const countResult = await db.execute(
          sql.raw(`SELECT COUNT(*) as count FROM "${table}"`)
        ) as any[];
        const count = Number(countResult[0]?.count || 0);
        console.log(`   ${table}: ${count} records`);
      }
      
      console.log('');
      console.log('🚀 Database is ready for launch!');
    }
  } catch (error) {
    console.error('❌ Error verifying tables:', error);
    process.exit(1);
  }

  process.exit(0);
}

verifyTables();

