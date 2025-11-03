# TROGDOR THE BURNINATOR - COMPLETE PROJECT CONTEXT

## PROJECT OVERVIEW

**Project Name:** The Cult of Trogdor the Burninator  
**Type:** Community-driven meme project with Web3 integration, Twitter automation, AI image generation, and gamified leaderboard  
**Design Aesthetic:** Excalidraw/hand-drawn pencil sketch style with white backgrounds, maintaining crude amateur aesthetic true to original Trogdor lore  
**Target Audience:** Solana degens, crypto communities, nostalgic millennials, meme enthusiasts

### Core Concept
A cult-like community website where every user account is a "ledger entry" in the Cult of Trogdor. Users earn points ("offerings") by mentioning the project on Twitter/X, with high-quality content earning more points. Top contributors receive token payouts. The site features AI-generated Trogdor memes, rich lore history, and gamified community engagement.

---

## TECH STACK

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom Excalidraw-inspired theme
- **UI Components:** Shadcn/ui (customized for hand-drawn aesthetic)
- **State Management:** Zustand or React Context
- **Web3 Library:** wagmi + viem (Solana: @solana/wallet-adapter)
- **Animations:** Framer Motion (subtle, maintaining sketch aesthetic)

### Backend
- **Runtime:** Node.js 20+ with TypeScript
- **Framework:** Next.js API Routes + tRPC (type-safe APIs)
- **Database:** PostgreSQL (primary) via Supabase or Neon
- **Cache/Queue:** Redis (Upstash for serverless)
- **ORM:** Drizzle ORM (lightweight, TypeScript-native)
- **Authentication:** NextAuth.js v5 (Auth.js) with Web3 wallet support
- **Webhooks:** Svix or custom webhook handler with retry logic

### External APIs & Services
- **Twitter/X API:** twitterapi.io (webhooks for mention monitoring)
- **AI Image Generation:** Replicate API (stable-diffusion or custom model)
- **Web3 RPC:** Helius (Solana) or Alchemy (if multi-chain)
- **File Storage:** Cloudflare R2 or Supabase Storage
- **Analytics:** PostHog or Mixpanel

### DevOps & Deployment
- **Hosting:** Vercel (frontend + serverless functions)
- **Database:** Supabase (Postgres + Auth + Storage) or Neon
- **Redis:** Upstash Redis (serverless, global)
- **Monitoring:** Sentry (error tracking), BetterStack (uptime)
- **CI/CD:** GitHub Actions
- **Environment Management:** Vercel environment variables

---

## PROJECT STRUCTURE

```
trogdor-burninator/
├── .github/
│   └── workflows/
│       └── ci.yml
├── app/                          # Next.js 14 app directory
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/                   # Main app routes
│   │   ├── history/              # Trogdor history page
│   │   ├── products/             # Products showcase
│   │   ├── generator/            # AI image generator
│   │   ├── leaderboard/          # Offerings leaderboard
│   │   └── profile/[address]/   # User profiles
│   ├── api/                      # API routes
│   │   ├── trpc/[trpc]/         # tRPC router
│   │   ├── webhooks/
│   │   │   ├── twitter/         # Twitter webhook endpoint
│   │   │   └── verify/          # Webhook verification
│   │   ├── auth/[...nextauth]/  # NextAuth routes
│   │   └── cron/                # Scheduled tasks
│   │       └── leaderboard-refresh/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── src/
│   ├── components/
│   │   ├── ui/                  # Shadcn components (customized)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── web3/
│   │   │   ├── WalletConnect.tsx
│   │   │   └── SignMessage.tsx
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardTable.tsx
│   │   │   ├── LeaderboardFilters.tsx
│   │   │   └── UserCard.tsx
│   │   ├── generator/
│   │   │   ├── ImagePromptForm.tsx
│   │   │   ├── GeneratedImage.tsx
│   │   │   └── GenerationQueue.tsx
│   │   └── trogdor/
│   │       ├── TrogdorAnimation.tsx
│   │       └── BurninationProgress.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts        # Drizzle schema definitions
│   │   │   ├── migrations/      # SQL migrations
│   │   │   └── index.ts         # DB client
│   │   ├── api/
│   │   │   ├── twitter.ts       # Twitter API client
│   │   │   ├── replicate.ts     # Replicate API client
│   │   │   └── web3.ts          # Web3 utilities
│   │   ├── auth/
│   │   │   ├── config.ts        # NextAuth config
│   │   │   └── providers.ts     # Auth providers
│   │   ├── redis/
│   │   │   ├── client.ts        # Redis client
│   │   │   └── keys.ts          # Redis key patterns
│   │   ├── queue/
│   │   │   ├── twitter-processor.ts
│   │   │   └── image-generator.ts
│   │   └── utils/
│   │       ├── scoring.ts       # Leaderboard scoring logic
│   │       ├── idempotency.ts   # Idempotency helpers
│   │       └── validation.ts    # Zod schemas
│   ├── server/
│   │   ├── routers/             # tRPC routers
│   │   │   ├── user.ts
│   │   │   ├── leaderboard.ts
│   │   │   ├── twitter.ts
│   │   │   └── generator.ts
│   │   ├── context.ts           # tRPC context
│   │   └── index.ts             # Root router
│   ├── hooks/                   # Custom React hooks
│   │   ├── useWallet.ts
│   │   ├── useLeaderboard.ts
│   │   └── useTwitterAuth.ts
│   ├── types/
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── twitter.ts
│   └── config/
│       ├── site.ts              # Site config
│       ├── theme.ts             # Excalidraw theme config
│       └── constants.ts         # App constants
├── public/
│   ├── images/
│   │   └── trogdor/             # Trogdor assets
│   └── fonts/                   # Hand-drawn fonts
├── scripts/
│   ├── seed-db.ts               # Database seeding
│   └── setup-webhooks.ts        # Twitter webhook setup
├── drizzle.config.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
└── package.json
```

---

## DATABASE SCHEMA

### Schema Design (Drizzle ORM)

```typescript
// src/lib/db/schema.ts

import { pgTable, text, timestamp, integer, jsonb, boolean, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============ USERS TABLE ============
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: text('wallet_address').notNull().unique(),
  username: text('username'),
  twitterHandle: text('twitter_handle').unique(),
  twitterId: text('twitter_id').unique(),
  twitterAccessToken: text('twitter_access_token'),
  twitterRefreshToken: text('twitter_refresh_token'),
  twitterTokenExpiry: timestamp('twitter_token_expiry'),
  profileImage: text('profile_image'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  lastActive: timestamp('last_active').defaultNow(),
  totalOfferings: integer('total_offerings').default(0).notNull(),
  currentRank: integer('current_rank'),
  isVerified: boolean('is_verified').default(false),
  metadata: jsonb('metadata').$type<{
    bio?: string;
    discordId?: string;
    telegramId?: string;
  }>(),
}, (table) => ({
  walletIdx: index('wallet_idx').on(table.walletAddress),
  twitterIdIdx: index('twitter_id_idx').on(table.twitterId),
  rankIdx: index('rank_idx').on(table.currentRank),
}));

// ============ TWITTER MENTIONS TABLE ============
export const twitterMentions = pgTable('twitter_mentions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tweetId: text('tweet_id').notNull().unique(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  tweetUrl: text('tweet_url').notNull(),
  content: text('content').notNull(),
  hasImage: boolean('has_image').default(false),
  hasVideo: boolean('has_video').default(false),
  likes: integer('likes').default(0),
  retweets: integer('retweets').default(0),
  replies: integer('replies').default(0),
  impressions: integer('impressions').default(0),
  qualityScore: integer('quality_score').notNull(), // 1-100
  pointsAwarded: integer('points_awarded').notNull(),
  createdAt: timestamp('created_at').notNull(),
  processedAt: timestamp('processed_at').defaultNow(),
  isVerified: boolean('is_verified').default(true),
  metadata: jsonb('metadata').$type<{
    sentiment?: string;
    topics?: string[];
    moderationFlags?: string[];
  }>(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  tweetIdIdx: uniqueIndex('tweet_id_idx').on(table.tweetId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
  pointsIdx: index('points_idx').on(table.pointsAwarded),
}));

// ============ LEADERBOARD SNAPSHOTS TABLE ============
export const leaderboardSnapshots = pgTable('leaderboard_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rank: integer('rank').notNull(),
  totalPoints: integer('total_points').notNull(),
  totalMentions: integer('total_mentions').notNull(),
  averageQuality: integer('average_quality').notNull(),
  period: text('period').notNull(), // 'daily', 'weekly', 'monthly', 'alltime'
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  snapshotAt: timestamp('snapshot_at').defaultNow().notNull(),
}, (table) => ({
  userPeriodIdx: index('user_period_idx').on(table.userId, table.period),
  periodRankIdx: index('period_rank_idx').on(table.period, table.rank),
}));

// ============ GENERATED IMAGES TABLE ============
export const generatedImages = pgTable('generated_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  prompt: text('prompt').notNull(),
  imageUrl: text('image_url').notNull(),
  replicateId: text('replicate_id').notNull().unique(),
  status: text('status').notNull(), // 'pending', 'processing', 'completed', 'failed'
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  downloads: integer('downloads').default(0),
  likes: integer('likes').default(0),
  metadata: jsonb('metadata').$type<{
    model?: string;
    seed?: number;
    parameters?: Record<string, any>;
  }>(),
}, (table) => ({
  userIdIdx: index('gen_user_id_idx').on(table.userId),
  statusIdx: index('status_idx').on(table.status),
  replicateIdIdx: uniqueIndex('replicate_id_idx').on(table.replicateId),
}));

// ============ WEBHOOK EVENTS TABLE (Idempotency) ============
export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  webhookId: text('webhook_id').notNull().unique(),
  source: text('source').notNull(), // 'twitter', 'replicate'
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  processed: boolean('processed').default(false),
  processedAt: timestamp('processed_at'),
  receivedAt: timestamp('received_at').defaultNow().notNull(),
  retryCount: integer('retry_count').default(0),
  error: text('error'),
}, (table) => ({
  webhookIdIdx: uniqueIndex('webhook_id_idx').on(table.webhookId),
  processedIdx: index('processed_idx').on(table.processed),
  receivedAtIdx: index('received_at_idx').on(table.receivedAt),
}));

// ============ PAYOUTS TABLE ============
export const payouts = pgTable('payouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  amount: integer('amount').notNull(), // In token smallest units
  rank: integer('rank').notNull(),
  period: text('period').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  transactionHash: text('transaction_hash'),
  status: text('status').notNull(), // 'pending', 'processing', 'completed', 'failed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
}, (table) => ({
  userIdIdx: index('payout_user_id_idx').on(table.userId),
  statusIdx: index('payout_status_idx').on(table.status),
}));

// ============ RELATIONS ============
export const usersRelations = relations(users, ({ many }) => ({
  mentions: many(twitterMentions),
  images: many(generatedImages),
  snapshots: many(leaderboardSnapshots),
  payouts: many(payouts),
}));

export const twitterMentionsRelations = relations(twitterMentions, ({ one }) => ({
  user: one(users, {
    fields: [twitterMentions.userId],
    references: [users.id],
  }),
}));
```

---

## REDIS SCHEMA & CACHING STRATEGY

### Redis Key Patterns

```typescript
// src/lib/redis/keys.ts

export const RedisKeys = {
  // Idempotency
  webhookEvent: (webhookId: string) => `webhook:event:${webhookId}`,
  tweetProcessed: (tweetId: string) => `tweet:processed:${tweetId}`,
  imageGeneration: (replicateId: string) => `image:gen:${replicateId}`,
  
  // Rate limiting
  userRateLimit: (userId: string, action: string) => `rate:${action}:${userId}`,
  ipRateLimit: (ip: string, action: string) => `rate:${action}:ip:${ip}`,
  
  // Leaderboard cache
  leaderboard: (period: string) => `leaderboard:${period}`,
  userRank: (userId: string, period: string) => `rank:${period}:${userId}`,
  
  // Queue
  twitterQueue: 'queue:twitter:mentions',
  imageQueue: 'queue:image:generation',
  payoutQueue: 'queue:payouts',
  
  // Session/Auth
  userSession: (sessionId: string) => `session:${sessionId}`,
  walletNonce: (address: string) => `nonce:${address}`,
  
  // Analytics
  dailyStats: (date: string) => `stats:daily:${date}`,
  realtimeMetrics: 'metrics:realtime',
} as const;
```

### Cache Strategy

```typescript
// Leaderboard: Cache for 5 minutes, refresh in background
// Tweet processing: 24-hour idempotency window
// Image generation: 1-hour status cache
// Rate limits: Sliding window (100 requests/hour per user)
```

---

## API INTEGRATION GUIDES

### 1. Twitter API (twitterapi.io) Integration

```typescript
// src/lib/api/twitter.ts

import axios from 'axios';
import { env } from '@/config/env';

export class TwitterClient {
  private apiKey = env.TWITTER_API_KEY;
  private baseUrl = 'https://api.twitterapi.io/v2';

  // Setup webhook for mention monitoring
  async setupWebhook(webhookUrl: string) {
    return await axios.post(
      `${this.baseUrl}/webhooks`,
      {
        url: webhookUrl,
        events: ['tweet.mention', 'tweet.reply']
      },
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      }
    );
  }

  // Fetch tweet details with metrics
  async getTweetMetrics(tweetId: string) {
    const response = await axios.get(
      `${this.baseUrl}/tweets/${tweetId}`,
      {
        params: {
          'tweet.fields': 'public_metrics,created_at,entities',
          'user.fields': 'verified,public_metrics'
        },
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      }
    );
    
    return response.data;
  }

  // OAuth flow for linking user accounts
  async getAuthUrl(state: string) {
    const params = new URLSearchParams({
      client_id: env.TWITTER_CLIENT_ID,
      redirect_uri: env.TWITTER_REDIRECT_URI,
      response_type: 'code',
      scope: 'tweet.read users.read offline.access',
      state,
      code_challenge: 'challenge', // Implement PKCE
      code_challenge_method: 'S256'
    });
    
    return `https://twitter.com/i/oauth2/authorize?${params}`;
  }
}
```

### 2. Replicate AI Image Generation

```typescript
// src/lib/api/replicate.ts

import Replicate from 'replicate';
import { env } from '@/config/env';

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

export async function generateTrogdorImage(prompt: string, userId: string) {
  // Add Trogdor-specific style to prompt
  const enhancedPrompt = `
    ${prompt}, 
    crude pencil sketch on cream lined notebook paper with blue horizontal lines,
    intentionally amateur hand-drawn style, 
    S-shaped dragon with beefy arm, consummate V's,
    Trogdor the Burninator aesthetic,
    childlike drawing with confidence
  `;

  const prediction = await replicate.predictions.create({
    version: "stability-ai/sdxl:...", // Your model version
    input: {
      prompt: enhancedPrompt,
      negative_prompt: "photorealistic, professional, polished, 3D render",
      num_inference_steps: 50,
      guidance_scale: 7.5,
      width: 1024,
      height: 1024,
    },
  });

  // Store in database with pending status
  await db.insert(generatedImages).values({
    userId,
    prompt,
    replicateId: prediction.id,
    status: 'pending',
  });

  return prediction;
}

export async function checkGenerationStatus(replicateId: string) {
  const prediction = await replicate.predictions.get(replicateId);
  return prediction;
}
```

### 3. Web3 Wallet Authentication (Solana)

```typescript
// src/lib/auth/web3.ts

import { verify } from '@noble/ed25519';
import bs58 from 'bs58';
import { createHash } from 'crypto';

export async function generateNonce(address: string): Promise<string> {
  const nonce = createHash('sha256')
    .update(address + Date.now() + Math.random())
    .digest('hex')
    .slice(0, 32);
  
  // Store nonce in Redis with 5-minute expiry
  await redis.set(
    RedisKeys.walletNonce(address),
    nonce,
    'EX',
    300
  );
  
  return nonce;
}

export async function verifyWalletSignature(
  address: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    // Get stored nonce
    const storedNonce = await redis.get(RedisKeys.walletNonce(address));
    if (!storedNonce || !message.includes(storedNonce)) {
      return false;
    }

    // Verify signature
    const publicKey = bs58.decode(address);
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);
    
    const isValid = await verify(signatureBytes, messageBytes, publicKey);
    
    // Delete nonce after verification
    if (isValid) {
      await redis.del(RedisKeys.walletNonce(address));
    }
    
    return isValid;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}
```

---

## WEBHOOK HANDLER WITH IDEMPOTENCY

```typescript
// app/api/webhooks/twitter/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { webhookEvents, twitterMentions } from '@/lib/db/schema';
import { redis } from '@/lib/redis';
import { RedisKeys } from '@/lib/redis/keys';
import { eq } from 'drizzle-orm';
import { calculateQualityScore } from '@/lib/utils/scoring';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const webhookId = body.id || body.data?.id;
  
  if (!webhookId) {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }

  // ============ MULTI-LAYER IDEMPOTENCY ============
  
  // Layer 1: Redis check (fast)
  const redisKey = RedisKeys.webhookEvent(webhookId);
  const alreadyProcessed = await redis.get(redisKey);
  
  if (alreadyProcessed) {
    console.log(`Webhook ${webhookId} already processed (Redis)`);
    return NextResponse.json({ status: 'already_processed' });
  }

  // Layer 2: Database check (authoritative)
  const existingEvent = await db
    .select()
    .from(webhookEvents)
    .where(eq(webhookEvents.webhookId, webhookId))
    .limit(1);

  if (existingEvent.length > 0) {
    // Update Redis cache
    await redis.set(redisKey, '1', 'EX', 86400); // 24 hours
    return NextResponse.json({ status: 'already_processed' });
  }

  // ============ PROCESS WEBHOOK ============
  
  try {
    // Store webhook event
    await db.insert(webhookEvents).values({
      webhookId,
      source: 'twitter',
      eventType: body.event_type || 'mention',
      payload: body,
      processed: false,
    });

    // Extract tweet data
    const tweet = body.data;
    const tweetId = tweet.id;
    const userId = tweet.author_id; // Need to map to our user
    
    // Check if tweet already processed
    const existingMention = await db
      .select()
      .from(twitterMentions)
      .where(eq(twitterMentions.tweetId, tweetId))
      .limit(1);
    
    if (existingMention.length > 0) {
      await markWebhookProcessed(webhookId);
      return NextResponse.json({ status: 'tweet_already_processed' });
    }

    // Fetch full tweet metrics from Twitter API
    const twitterClient = new TwitterClient();
    const tweetData = await twitterClient.getTweetMetrics(tweetId);
    
    // Find user by Twitter ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.twitterId, userId))
      .limit(1);
    
    if (user.length === 0) {
      console.log(`User not found for Twitter ID ${userId}`);
      await markWebhookProcessed(webhookId);
      return NextResponse.json({ status: 'user_not_found' });
    }

    // Calculate quality score
    const qualityScore = calculateQualityScore({
      likes: tweetData.public_metrics.like_count,
      retweets: tweetData.public_metrics.retweet_count,
      replies: tweetData.public_metrics.reply_count,
      impressions: tweetData.public_metrics.impression_count,
      hasImage: tweetData.entities?.media?.some((m: any) => m.type === 'photo'),
      hasVideo: tweetData.entities?.media?.some((m: any) => m.type === 'video'),
      authorVerified: tweetData.author?.verified,
      authorFollowers: tweetData.author?.public_metrics.followers_count,
    });

    // Points = quality score (1-100)
    const pointsAwarded = qualityScore;

    // Insert mention record
    await db.insert(twitterMentions).values({
      tweetId,
      userId: user[0].id,
      tweetUrl: `https://twitter.com/${tweetData.author.username}/status/${tweetId}`,
      content: tweet.text,
      hasImage: tweetData.entities?.media?.some((m: any) => m.type === 'photo') || false,
      hasVideo: tweetData.entities?.media?.some((m: any) => m.type === 'video') || false,
      likes: tweetData.public_metrics.like_count,
      retweets: tweetData.public_metrics.retweet_count,
      replies: tweetData.public_metrics.reply_count,
      impressions: tweetData.public_metrics.impression_count || 0,
      qualityScore,
      pointsAwarded,
      createdAt: new Date(tweetData.created_at),
    });

    // Update user total offerings
    await db
      .update(users)
      .set({
        totalOfferings: user[0].totalOfferings + pointsAwarded,
        lastActive: new Date(),
      })
      .where(eq(users.id, user[0].id));

    // Mark webhook as processed
    await markWebhookProcessed(webhookId);
    
    // Set Redis cache
    await redis.set(redisKey, '1', 'EX', 86400);
    await redis.set(RedisKeys.tweetProcessed(tweetId), '1', 'EX', 86400);

    // Invalidate leaderboard cache
    await redis.del(RedisKeys.leaderboard('alltime'));
    await redis.del(RedisKeys.leaderboard('weekly'));

    return NextResponse.json({ 
      status: 'processed',
      pointsAwarded,
      qualityScore 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Update retry count
    await db
      .update(webhookEvents)
      .set({ 
        retryCount: sql`retry_count + 1`,
        error: String(error) 
      })
      .where(eq(webhookEvents.webhookId, webhookId));
    
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function markWebhookProcessed(webhookId: string) {
  await db
    .update(webhookEvents)
    .set({ 
      processed: true, 
      processedAt: new Date() 
    })
    .where(eq(webhookEvents.webhookId, webhookId));
}
```

---

## QUALITY SCORING ALGORITHM

```typescript
// src/lib/utils/scoring.ts

interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  hasImage: boolean;
  hasVideo: boolean;
  authorVerified: boolean;
  authorFollowers: number;
}

export function calculateQualityScore(metrics: TweetMetrics): number {
  let score = 0;

  // Base engagement score (0-50 points)
  const engagementRate = 
    (metrics.likes + metrics.retweets * 2 + metrics.replies * 1.5) / 
    Math.max(metrics.impressions, 1);
  
  score += Math.min(engagementRate * 10000, 50); // Cap at 50

  // Absolute engagement bonus (0-20 points)
  const totalEngagement = metrics.likes + metrics.retweets + metrics.replies;
  if (totalEngagement > 100) score += 20;
  else if (totalEngagement > 50) score += 15;
  else if (totalEngagement > 20) score += 10;
  else if (totalEngagement > 10) score += 5;

  // Media bonus (0-10 points)
  if (metrics.hasVideo) score += 10;
  else if (metrics.hasImage) score += 5;

  // Author credibility (0-10 points)
  if (metrics.authorVerified) score += 5;
  if (metrics.authorFollowers > 10000) score += 5;
  else if (metrics.authorFollowers > 1000) score += 3;

  // Viral bonus (0-10 points)
  if (metrics.impressions > 100000) score += 10;
  else if (metrics.impressions > 50000) score += 7;
  else if (metrics.impressions > 10000) score += 5;

  // Normalize to 1-100
  return Math.max(1, Math.min(100, Math.round(score)));
}
```

---

## DESIGN SYSTEM (EXCALIDRAW AESTHETIC)

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Excalidraw-inspired palette
        background: '#FFFFFF',
        foreground: '#1E1E1E',
        sketch: {
          light: '#F8F9FA',
          DEFAULT: '#E9ECEF',
          dark: '#DEE2E6',
        },
        accent: {
          green: '#10B981', // Trogdor green
          red: '#EF4444',   // Fire/burnination
          blue: '#3B82F6',  // Links
          yellow: '#F59E0B', // Highlights
        },
        pencil: {
          light: '#6B7280',
          DEFAULT: '#4B5563',
          dark: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'], // Hand-drawn font
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'sketch': '0 2px 0 0 rgba(0,0,0,0.1)',
        'sketch-lg': '0 4px 0 0 rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'sketch': '2px', // Slightly imperfect corners
      },
      animation: {
        'wiggle': 'wiggle 0.3s ease-in-out',
        'burn': 'burn 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        burn: {
          '0%, 100%': { opacity: '1', transform: 'translateY(0)' },
          '50%': { opacity: '0.7', transform: 'translateY(-2px)' },
        }
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### Custom CSS for Hand-Drawn Effects

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --notebook-line: #D1D5DB;
    --notebook-margin: #EF4444;
  }
  
  body {
    @apply bg-white text-foreground;
    font-feature-settings: "cv05", "cv09";
  }
}

@layer components {
  /* Hand-drawn border effect */
  .border-sketch {
    border: 2px solid currentColor;
    border-radius: 2px;
    box-shadow: 
      0 0 0 1px rgba(0,0,0,0.05),
      inset 0 0 0 1px rgba(255,255,255,0.1);
  }
  
  /* Notebook paper effect */
  .notebook-paper {
    background-image: 
      linear-gradient(transparent, transparent 23px, var(--notebook-line) 23px, var(--notebook-line) 24px),
      linear-gradient(90deg, var(--notebook-margin) 0px, var(--notebook-margin) 1px, transparent 1px);
    background-size: 100% 24px, 60px 100%;
    background-position: 0 0, 40px 0;
    position: relative;
  }
  
  /* Hand-drawn button */
  .btn-sketch {
    @apply px-4 py-2 border-2 border-pencil font-hand text-lg;
    @apply hover:shadow-sketch-lg transition-all duration-150;
    @apply active:translate-y-0.5;
    position: relative;
  }
  
  .btn-sketch::before {
    content: '';
    position: absolute;
    inset: -2px;
    border: 2px solid currentColor;
    border-radius: 3px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .btn-sketch:hover::before {
    opacity: 0.3;
  }
  
  /* Trogdor flame effect */
  .flame-text {
    background: linear-gradient(45deg, #EF4444, #F59E0B, #EF4444);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: flame 2s ease infinite;
  }
  
  @keyframes flame {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
}
```

---

## ENVIRONMENT VARIABLES

```bash
# .env.local.example

# Database
DATABASE_URL="postgresql://user:password@host:5432/trogdor"
DIRECT_URL="postgresql://user:password@host:5432/trogdor" # For migrations

# Redis
REDIS_URL="redis://default:password@host:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Twitter API (twitterapi.io)
TWITTER_API_KEY="your-api-key"
TWITTER_CLIENT_ID="your-client-id"
TWITTER_CLIENT_SECRET="your-client-secret"
TWITTER_REDIRECT_URI="http://localhost:3000/api/auth/callback/twitter"
TWITTER_WEBHOOK_SECRET="your-webhook-secret"

# Replicate
REPLICATE_API_TOKEN="r8_your-token"

# Solana RPC
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
# Or use Helius: https://mainnet.helius-rpc.com/?api-key=your-key

# File Storage
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_ACCESS_KEY="your-access-key"
CLOUDFLARE_R2_SECRET_KEY="your-secret-key"
CLOUDFLARE_R2_BUCKET="trogdor-images"

# Optional: Analytics
POSTHOG_API_KEY="your-posthog-key"
SENTRY_DSN="your-sentry-dsn"

# Optional: Rate Limiting
RATE_LIMIT_ENABLED="true"
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="3600000" # 1 hour
```

---

## KEY IMPLEMENTATION NOTES

### 1. Web3 Authentication Flow
1. User clicks "Connect Wallet"
2. Frontend generates nonce, stores in Redis
3. User signs message with wallet
4. Backend verifies signature + nonce
5. Create/update user record with wallet address
6. Issue NextAuth session token

### 2. Twitter Integration Flow
1. User links Twitter account (OAuth)
2. Store access token + refresh token
3. Setup webhook endpoint `/api/webhooks/twitter`
4. Twitter sends mention events to webhook
5. Process tweet, calculate score, award points
6. Idempotency: Check Redis → Check DB → Process

### 3. Leaderboard Update Strategy
- Real-time: Update user total on each mention
- Cached rankings: Refresh every 5 minutes (cron job)
- Period snapshots: Daily cron creates snapshot records
- Frontend: Poll leaderboard API every 30 seconds

### 4. Image Generation Flow
1. User submits prompt
2. Enhance prompt with Trogdor style keywords
3. Submit to Replicate API
4. Store pending record in DB
5. Poll Replicate for status (or use webhook)
6. Update DB when complete
7. Upload image to R2 storage

### 5. Payout Distribution
- Weekly cron job calculates top N positions
- Creates payout records with 'pending' status
- Admin dashboard to approve payouts
- Solana transaction sends tokens
- Update payout status to 'completed'

---

## DEPLOYMENT CHECKLIST

### Pre-Deploy
- [ ] All environment variables set in Vercel
- [ ] Database migrations run
- [ ] Redis instance provisioned
- [ ] Twitter webhooks registered
- [ ] Replicate API tested
- [ ] File storage bucket created

### Deploy Steps
1. Push to GitHub
2. Vercel auto-deploys
3. Run migrations: `npm run db:migrate`
4. Setup Twitter webhook: `npm run setup:webhooks`
5. Test authentication flow
6. Test Twitter mention processing
7. Test image generation
8. Monitor Sentry for errors

### Post-Deploy
- [ ] Setup monitoring alerts
- [ ] Configure rate limits
- [ ] Test webhook idempotency
- [ ] Verify leaderboard updates
- [ ] Test payout flow (testnet)

---

## SECURITY BEST PRACTICES

1. **Webhook Verification**: Always verify Twitter webhook signatures
2. **Rate Limiting**: Implement per-user and per-IP limits
3. **SQL Injection**: Use Drizzle ORM parameterized queries
4. **XSS Protection**: Sanitize user-generated content
5. **CSRF**: NextAuth handles CSRF tokens
6. **Secrets**: Never commit `.env` files
7. **API Keys**: Rotate regularly, use different keys for dev/prod
8. **Database**: Enable row-level security (RLS) in Supabase
9. **Wallet Security**: Never store private keys
10. **Input Validation**: Use Zod schemas for all inputs

---

## TESTING STRATEGY

### Unit Tests (Vitest)
- Scoring algorithm
- Utility functions
- Redis key patterns

### Integration Tests
- Database operations (Drizzle)
- API routes (Next.js test mode)
- Twitter client mocks
- Replicate client mocks

### E2E Tests (Playwright)
- User registration flow
- Twitter linking
- Image generation
- Leaderboard display

---

## PERFORMANCE OPTIMIZATION

1. **Database Indexes**: Already defined in schema
2. **Redis Caching**: Leaderboard, user ranks, tweet status
3. **CDN**: Serve images from R2 + Cloudflare CDN
4. **Next.js**: Use `loading.tsx` and `Suspense` boundaries
5. **Image Optimization**: Next.js Image component
6. **Bundle Size**: Dynamic imports for heavy components
7. **API Response Times**: Target <200ms for cached endpoints
8. **Database Connections**: Use connection pooling (Supabase Pooler)

---

## MONITORING & OBSERVABILITY

### Metrics to Track
- Tweet processing latency
- Image generation success rate
- Leaderboard update frequency
- User authentication failures
- API error rates
- Database query times
- Redis cache hit rate

### Alerting Rules
- Webhook processing failures > 5%
- API response time > 1s
- Database connection pool exhaustion
- Redis connection failures
- Unusual spike in new users (potential spam)

---

## TROGDOR LORE INTEGRATION

### Content Pages
Reference the research document for:
- **History Page**: Full timeline (2003-2025)
- **Lore**: Strong Bad Email #58 transcript
- **Quotes**: "Consummate V's", "THATCHED-ROOF COTTAGES!"
- **Products**: Guitar Hero II, Board Game ($1.4M Kickstarter)
- **Easter Eggs**: Hidden references, Wormdingler, Peasant's Quest

### Visual Elements
- Crude pencil sketch aesthetic throughout
- Notebook paper backgrounds
- Hand-drawn navigation elements
- Flame animations for burnination
- Majesty lines around important elements

---

## ROADMAP FEATURES (Post-MVP)

1. **AI-Powered Tweet Responses**: Bot replies with generated Trogdor images
2. **NFT Minting**: Top contributors get unique Trogdor NFTs
3. **DAO Governance**: Token holders vote on burnination targets
4. **Multi-Chain Support**: Expand beyond Solana
5. **Mobile App**: React Native with same aesthetic
6. **Merchandise Store**: Print-on-demand Trogdor merch
7. **Burnination Map**: Visual map showing recent mentions
8. **Achievement System**: Badges for milestones
9. **Referral Program**: Invite friends, earn bonus points
10. **API for Developers**: Let community build on Trogdor data

---

## CURSOR-SPECIFIC INSTRUCTIONS

When working with Cursor IDE on this project:

1. **Code Generation**: Always use TypeScript with strict mode
2. **Component Structure**: Prefer Server Components, use Client Components sparingly
3. **Database Queries**: Use Drizzle ORM, never raw SQL
4. **API Routes**: Follow tRPC patterns for type safety
5. **Styling**: Use Tailwind utilities, custom classes from design system
6. **Error Handling**: Always wrap async operations in try-catch
7. **Validation**: Use Zod schemas for all external inputs
8. **Comments**: Add JSDoc comments for complex functions
9. **File Naming**: Use kebab-case for files, PascalCase for components
10. **Imports**: Use absolute imports with `@/` prefix

---

## QUICK START COMMANDS

```bash
# Install dependencies
npm install

# Setup database
npm run db:migrate
npm run db:seed

# Setup webhooks
npm run setup:webhooks

# Development
npm run dev

# Build
npm run build

# Deploy
git push origin main # Vercel auto-deploys

# Database operations
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

---

## ADDITIONAL RESOURCES

- **Trogdor Research**: See TROGDOR_RESEARCH.md
- **Design Mockups**: See Excalidraw file
- **API Documentation**: Will be auto-generated via tRPC
- **Database Schema Diagram**: Generate with `dbdocs.io`

---

**Remember**: The key to this project is maintaining the crude, hand-drawn, intentionally amateur aesthetic while building a sophisticated, production-ready backend. Every pixel should scream "CONSUMMATE V'S!" while every API endpoint whispers "enterprise-grade reliability."

Now go forth and BURNINATE! 🔥🐉
