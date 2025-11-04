#!/usr/bin/env tsx
/**
 * Test the cron endpoint manually to verify it's working
 * This simulates what Vercel's cron service will do
 */

require('dotenv').config({ path: '.env.local' });

async function testCronEndpoint() {
  const PRODUCTION_URL = process.env.NEXTAUTH_URL || 'https://your-site.vercel.app';
  const CRON_SECRET = process.env.CRON_SECRET;

  if (!CRON_SECRET) {
    console.error('❌ CRON_SECRET not found in .env.local');
    console.log('This is expected - the secret is in Vercel, not locally');
    console.log('');
    console.log('To test manually, run:');
    console.log(`curl -H "Authorization: Bearer YOUR_CRON_SECRET" ${PRODUCTION_URL}/api/cron/fetch-mentions`);
    return;
  }

  console.log('🔍 Testing cron endpoint...');
  console.log(`📍 URL: ${PRODUCTION_URL}/api/cron/fetch-mentions`);
  console.log('');

  try {
    // Test WITHOUT authorization (should fail)
    console.log('1️⃣ Testing WITHOUT authorization (should return 401)...');
    const failResponse = await fetch(`${PRODUCTION_URL}/api/cron/fetch-mentions`, {
      method: 'GET',
    });
    
    if (failResponse.status === 401) {
      console.log('   ✅ Correctly rejected unauthorized request');
    } else {
      console.log(`   ⚠️  Expected 401, got ${failResponse.status}`);
    }
    console.log('');

    // Test WITH authorization (should succeed)
    console.log('2️⃣ Testing WITH authorization (should return 200)...');
    const successResponse = await fetch(`${PRODUCTION_URL}/api/cron/fetch-mentions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });

    const data = await successResponse.json();
    
    if (successResponse.ok) {
      console.log('   ✅ Successfully authenticated!');
      console.log('');
      console.log('📊 Response:');
      console.log(`   Status: ${successResponse.status}`);
      console.log(`   Processed: ${data.processed || 0}`);
      console.log(`   Skipped: ${data.skipped || 0}`);
      console.log(`   Errors: ${data.errors || 0}`);
      console.log(`   Total found: ${data.total || 0}`);
      console.log('');
      console.log('🎉 Cron endpoint is working perfectly!');
    } else {
      console.log(`   ❌ Request failed with status ${successResponse.status}`);
      console.log('   Response:', data);
    }
  } catch (error: any) {
    console.error('❌ Error testing endpoint:', error.message);
    console.log('');
    console.log('💡 If you get a connection error, make sure:');
    console.log('   1. Your site is deployed to Vercel');
    console.log('   2. NEXTAUTH_URL in .env.local points to your production URL');
  }
}

console.log('🔥 CRON ENDPOINT TEST');
console.log('═══════════════════════════════════════');
console.log('');

testCronEndpoint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

