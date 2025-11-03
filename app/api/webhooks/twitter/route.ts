import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { twitterMentions, webhookEvents, users } from '@/lib/db/schema';
import { redis } from '@/lib/redis';
import { calculateQualityScore } from '@/lib/utils/scoring';
import { eq, and, sql } from 'drizzle-orm';
import crypto from 'crypto';

// Types for Twitter webhook payload
interface TwitterWebhookPayload {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  entities?: {
    urls?: Array<{ url: string; expanded_url: string }>;
    hashtags?: Array<{ tag: string }>;
    mentions?: Array<{ username: string; id: string }>;
  };
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

// Verify Twitter webhook signature
function verifyTwitterSignature(
  signature: string,
  timestamp: string,
  body: string
): boolean {
  const secret = process.env.TWITTER_WEBHOOK_SECRET;
  if (!secret) {
    console.error('TWITTER_WEBHOOK_SECRET not set');
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${timestamp}.${body}`);
  const expectedSignature = hmac.digest('hex');

  return signature === expectedSignature;
}

// Process the webhook event with idempotency
async function processWebhookEvent(eventId: string, payload: TwitterWebhookPayload) {
  // Layer 1: Redis idempotency check
  if (redis) {
    const redisKey = `webhook:processed:${eventId}`;
    const isProcessed = await redis.get(redisKey);
    
    if (isProcessed) {
      console.log(`[Webhook] Event ${eventId} already processed (Redis cache)`);
      return { success: true, cached: true };
    }
  }

  // Layer 2: Database idempotency check
  const existingEvent = await db.query.webhookEvents.findFirst({
    where: (events, { eq, and }) =>
      and(
        eq(events.webhookId, eventId),
        eq(events.eventType, 'twitter.mention')
      ),
  });

  if (existingEvent && existingEvent.processed) {
    console.log(`[Webhook] Event ${eventId} already processed (Database)`);
    
    // Update Redis cache
    if (redis) {
      await redis.setex(`webhook:processed:${eventId}`, 86400, '1'); // 24h
    }
    
    return { success: true, cached: true };
  }

  // Create/update webhook event record
  const [webhookEvent] = await db
    .insert(webhookEvents)
    .values({
      webhookId: eventId,
      source: 'twitter',
      eventType: 'twitter.mention',
      payload,
      processed: false,
    })
    .onConflictDoUpdate({
      target: webhookEvents.webhookId,
      set: {
        processed: false,
        retryCount: sql`${webhookEvents.retryCount} + 1`,
      },
    })
    .returning();

  try {
    // Calculate quality score
    const score = calculateQualityScore({
      text: payload.text,
      likes: payload.public_metrics?.like_count || 0,
      retweets: payload.public_metrics?.retweet_count || 0,
      replies: payload.public_metrics?.reply_count || 0,
      quotes: payload.public_metrics?.quote_count || 0,
      hasImage: (payload.entities?.urls?.length || 0) > 0,
      hasVideo: false, // Would need to check media objects
      hasHashtags: (payload.entities?.hashtags?.length || 0) > 0,
    });

    // Find user by Twitter ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.twitterId, payload.author_id))
      .limit(1);

    if (!user) {
      console.log(`[Webhook] User not found for Twitter ID: ${payload.author_id}`);
      
      // Mark as processed even if user not found
      await db
        .update(webhookEvents)
        .set({
          processed: true,
          processedAt: new Date(),
          error: 'user_not_found',
        })
        .where(eq(webhookEvents.id, webhookEvent.id));

      return { success: true, userNotFound: true };
    }

    // Save Twitter mention
    const [mention] = await db
      .insert(twitterMentions)
      .values({
        userId: user.id,
        tweetId: payload.id,
        tweetUrl: `https://twitter.com/i/web/status/${payload.id}`,
        content: payload.text,
        hasImage: (payload.entities?.urls?.length || 0) > 0,
        hasVideo: false, // Would need media objects to determine
        likes: payload.public_metrics?.like_count || 0,
        retweets: payload.public_metrics?.retweet_count || 0,
        replies: payload.public_metrics?.reply_count || 0,
        impressions: 0, // Not available in basic Twitter webhook payload
        qualityScore: score.totalScore,
        pointsAwarded: score.totalScore,
        createdAt: new Date(payload.created_at),
        metadata: score.breakdown as any,
      })
      .onConflictDoNothing() // Ignore if tweet already exists
      .returning();

    // Mark webhook as processed
    await db
      .update(webhookEvents)
      .set({
        processed: true,
        processedAt: new Date(),
      })
      .where(eq(webhookEvents.id, webhookEvent.id));

    // Mark as processed in Redis
    if (redis) {
      await redis.setex(`webhook:processed:${eventId}`, 86400, '1'); // 24h
      
      // Invalidate leaderboard cache
      await redis.del('leaderboard:alltime', 'leaderboard:monthly', 'leaderboard:weekly', 'leaderboard:daily');
    }

    console.log(`[Webhook] Successfully processed event ${eventId} - Score: ${score.totalScore}`);
    
    return {
      success: true,
      mentionId: mention?.id,
      score: score.totalScore,
    };
  } catch (error) {
    console.error(`[Webhook] Error processing event ${eventId}:`, error);

    // Mark as failed
    await db
      .update(webhookEvents)
      .set({
        processed: false,
        error: String(error),
      })
      .where(eq(webhookEvents.id, webhookEvent.id));

    throw error;
  }
}

// POST handler for Twitter webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-twitter-signature');
    const timestamp = request.headers.get('x-twitter-timestamp');

    // Verify signature
    if (!signature || !timestamp) {
      console.error('[Webhook] Missing signature or timestamp');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    if (!verifyTwitterSignature(signature, timestamp, body)) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: TwitterWebhookPayload = JSON.parse(body);
    
    // Extract event ID (use tweet ID as event ID)
    const eventId = payload.id;

    // Process the event with idempotency
    const result = await processWebhookEvent(eventId, payload);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[Webhook] Unhandled error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET handler for Twitter webhook challenge (required by Twitter)
export async function GET(request: NextRequest) {
  const crc_token = request.nextUrl.searchParams.get('crc_token');

  if (!crc_token) {
    return NextResponse.json(
      { error: 'Missing crc_token' },
      { status: 400 }
    );
  }

  const secret = process.env.TWITTER_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(crc_token);
  const response_token = 'sha256=' + hmac.digest('base64');

  return NextResponse.json({ response_token });
}

