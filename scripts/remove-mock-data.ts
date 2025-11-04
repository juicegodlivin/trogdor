import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../src/lib/db/schema';
import { inArray } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function removeMockData() {
  console.log('🔥 Starting mock data removal...\n');

  const connection = postgres(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // List of mock usernames to remove
    const mockUsernames = [
      'DragonLord',
      'BurnMaster',
      'TrogdorFan',
      'FlameWarrior',
      'CottageDestroyer',
      'PeasantSlayer',
      'ThatchedRoofHater',
      'Burninater',
      'FireBreather',
      'ConsummateVs',
    ];

    console.log('🗑️  Removing mock users:');
    mockUsernames.forEach(name => console.log(`   - ${name}`));
    console.log('');

    // Delete mock users
    const deletedUsers = await db
      .delete(users)
      .where(inArray(users.username, mockUsernames))
      .returning();

    console.log(`✅ Removed ${deletedUsers.length} mock users:\n`);
    deletedUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.walletAddress.slice(0, 8)}...)`);
    });

    console.log('\n🎉 Mock data removal complete!');
    console.log('\n📊 Remaining real users in database:');
    
    const remainingUsers = await db.select().from(users);
    console.log(`   Total: ${remainingUsers.length} users\n`);
    
    if (remainingUsers.length > 0) {
      remainingUsers.forEach(user => {
        console.log(`   - ${user.username || 'Anonymous'} (${user.walletAddress.slice(0, 8)}...) - ${user.totalOfferings} offerings`);
      });
    }

  } catch (error) {
    console.error('❌ Error removing mock data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the script
removeMockData()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

