import { NextRequest, NextResponse } from 'next/server';
import { getTwitterApi } from '@/lib/api/twitter';
import { db } from '@/lib/db';
import { users, twitterMentions } from '@/lib/db/schema';
import { calculateQualityScore } from '@/lib/utils/scoring';
import { eq, sql } from 'drizzle-orm';

const TWITTER_ACCOUNT = 'trogdorcult';

// Verify cron secret for security
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.warn('⚠️ CRON_SECRET not set - cron endpoint is unprotected!');
    return true; // Allow if not configured (development)
  }
  
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  console.log('🔥 Cron job triggered: Fetching Twitter mentions');
  
  // Verify authorization
  if (!verifyCronSecret(request)) {
    console.error('❌ Unauthorized cron request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const twitterApi = getTwitterApi();
    
    // Get the last processed mention to avoid duplicates
    const lastMention = await db.query.twitterMentions.findFirst({
      orderBy: (mentions, { desc }) => [desc(mentions.createdAt)],
    });

    let sinceTime: number | undefined;
    if (lastMention) {
      sinceTime = Math.floor(new Date(lastMention.createdAt).getTime() / 1000);
    }

    console.log(`📍 Fetching mentions since: ${sinceTime ? new Date(sinceTime * 1000).toISOString() : 'all recent'}`);

    // Fetch mentions
    const response = await twitterApi.searchMentions(TWITTER_ACCOUNT, {
      sinceTime,
    });

    // Handle both API response formats
    const mentions = response.tweets || response.data || [];

    if (mentions.length === 0) {
      console.log('✅ No new mentions found');
      return NextResponse.json({ 
        success: true, 
        processed: 0,
        message: 'No new mentions'
      });
    }

    console.log(`📊 Found ${mentions.length} new mentions`);

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each mention
    for (const tweet of mentions) {
      try {
        // Get author ID from either new or legacy format
        const authorId = tweet.author?.id || tweet.author_id;
        const createdAt = tweet.createdAt || tweet.created_at;
        
        if (!authorId) {
          console.log(`⚠️ Tweet ${tweet.id} missing author ID, skipping`);
          skippedCount++;
          continue;
        }

        // Find user by Twitter ID
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.twitterId, authorId))
          .limit(1);

        if (!user) {
          console.log(`⏭️ Skipped tweet ${tweet.id}: User hasn't linked Twitter account (ID: ${authorId})`);
          skippedCount++;
          continue;
        }

        // Check if already processed
        const existing = await db.query.twitterMentions.findFirst({
          where: (mentions, { eq }) => eq(mentions.tweetId, tweet.id),
        });

        if (existing) {
          skippedCount++;
          continue;
        }

        // Calculate quality score (use new or legacy format)
        const likes = tweet.likeCount ?? tweet.public_metrics?.like_count ?? 0;
        const retweets = tweet.retweetCount ?? tweet.public_metrics?.retweet_count ?? 0;
        const replies = tweet.replyCount ?? tweet.public_metrics?.reply_count ?? 0;
        const quotes = tweet.quoteCount ?? tweet.public_metrics?.quote_count ?? 0;

        const score = calculateQualityScore({
          text: tweet.text,
          likes,
          retweets,
          replies,
          quotes,
          hasImage: false, // TODO: Detect from entities
          hasVideo: false,
          hasHashtags: tweet.text.includes('#'),
        });

        console.log(`✅ Processing tweet ${tweet.id} from @${user.twitterHandle} - Score: ${score.totalScore}`);

        // Save mention
        await db.insert(twitterMentions).values({
          userId: user.id,
          tweetId: tweet.id,
          tweetUrl: `https://twitter.com/i/web/status/${tweet.id}`,
          content: tweet.text,
          hasImage: false,
          hasVideo: false,
          likes,
          retweets,
          replies,
          impressions: tweet.viewCount ?? tweet.public_metrics?.impression_count ?? 0,
          qualityScore: score.totalScore,
          pointsAwarded: score.totalScore,
          createdAt: new Date(createdAt!),
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

        processedCount++;
      } catch (error) {
        console.error(`❌ Error processing tweet ${tweet.id}:`, error);
        errorCount++;
      }
    }

    console.log(`📊 Summary: ${processedCount} processed, ${skippedCount} skipped, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      processed: processedCount,
      skipped: skippedCount,
      errors: errorCount,
      total: mentions.length,
    });
  } catch (error: any) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch mentions',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

