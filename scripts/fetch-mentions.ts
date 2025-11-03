#!/usr/bin/env tsx
/**
 * Manual script to fetch Twitter mentions and process them
 * Usage: tsx scripts/fetch-mentions.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { twitterApi } from '../src/lib/api/twitter';
import { db } from '../src/lib/db';
import { users, twitterMentions } from '../src/lib/db/schema';
import { calculateQualityScore } from '../src/lib/utils/scoring';
import { eq, sql } from 'drizzle-orm';

const TWITTER_ACCOUNT = 'trogdorcult';

async function fetchAndProcessMentions() {
  console.log('🔥 Starting mention fetch for @' + TWITTER_ACCOUNT);
  console.log('⏰ Time:', new Date().toISOString());
  console.log('');

  try {
    // 1. Get the last processed tweet ID to avoid duplicates
    const lastMention = await db.query.twitterMentions.findFirst({
      orderBy: (mentions, { desc }) => [desc(mentions.createdAt)],
    });

    const sinceId = lastMention?.tweetId;
    console.log('📍 Last processed tweet ID:', sinceId || 'None (fetching all recent)');
    console.log('');

    // 2. Fetch mentions from TwitterAPI.io
    console.log('🔍 Fetching mentions from TwitterAPI.io...');
    const response = await twitterApi.searchMentions(TWITTER_ACCOUNT, {
      maxResults: 100,
      sinceId,
    });

    if (!response.data || response.data.length === 0) {
      console.log('✅ No new mentions found');
      return;
    }

    console.log(`📊 Found ${response.data.length} new mentions`);
    console.log('');

    // 3. Process each mention
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const tweet of response.data) {
      try {
        console.log(`\n🐦 Processing tweet ${tweet.id}`);
        console.log(`   Author: @${tweet.author_id}`);
        console.log(`   Text: ${tweet.text.substring(0, 100)}...`);

        // Find user by Twitter ID
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.twitterId, tweet.author_id))
          .limit(1);

        if (!user) {
          console.log(`   ⏭️  Skipped: User hasn't linked Twitter account`);
          skippedCount++;
          continue;
        }

        // Check if already processed
        const existing = await db.query.twitterMentions.findFirst({
          where: (mentions, { eq }) => eq(mentions.tweetId, tweet.id),
        });

        if (existing) {
          console.log(`   ⏭️  Skipped: Already processed`);
          skippedCount++;
          continue;
        }

        // Calculate quality score
        const score = calculateQualityScore({
          text: tweet.text,
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
          quotes: tweet.public_metrics?.quote_count || 0,
          hasImage: (tweet.entities?.urls?.length || 0) > 0,
          hasVideo: false, // TwitterAPI.io may not provide this easily
          hasHashtags: (tweet.entities?.hashtags?.length || 0) > 0,
        });

        console.log(`   📈 Quality Score: ${score.totalScore}/100`);
        console.log(`   💎 Points Awarded: ${score.totalScore}`);

        // Save mention
        await db.insert(twitterMentions).values({
          userId: user.id,
          tweetId: tweet.id,
          tweetUrl: `https://twitter.com/i/web/status/${tweet.id}`,
          content: tweet.text,
          hasImage: (tweet.entities?.urls?.length || 0) > 0,
          hasVideo: false,
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
          impressions: tweet.public_metrics?.impression_count || 0,
          qualityScore: score.totalScore,
          pointsAwarded: score.totalScore,
          createdAt: new Date(tweet.created_at),
          metadata: score.breakdown as any,
        });

        // Update user's total offerings
        await db
          .update(users)
          .set({
            totalOfferings: sql`${users.totalOfferings} + ${score.totalScore}`,
            lastActive: new Date(),
          })
          .where(eq(users.id, user.id));

        console.log(`   ✅ Processed successfully`);
        processedCount++;
      } catch (error) {
        console.error(`   ❌ Error processing tweet:`, error);
        errorCount++;
      }
    }

    // Summary
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Processed: ${processedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total mentions found: ${response.data.length}`);
    console.log('═══════════════════════════════════════');
  } catch (error) {
    console.error('');
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
fetchAndProcessMentions()
  .then(() => {
    console.log('');
    console.log('🎉 Mention fetch complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

