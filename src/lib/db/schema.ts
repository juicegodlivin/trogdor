import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============ USERS TABLE ============
export const users = pgTable(
  'users',
  {
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
  },
  (table) => ({
    walletIdx: index('wallet_idx').on(table.walletAddress),
    twitterIdIdx: index('twitter_id_idx').on(table.twitterId),
    rankIdx: index('rank_idx').on(table.currentRank),
  })
);

// ============ TWITTER MENTIONS TABLE ============
export const twitterMentions = pgTable(
  'twitter_mentions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tweetId: text('tweet_id').notNull().unique(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
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
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    tweetIdIdx: uniqueIndex('tweet_id_idx').on(table.tweetId),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    pointsIdx: index('points_idx').on(table.pointsAwarded),
  })
);

// ============ LEADERBOARD SNAPSHOTS TABLE ============
export const leaderboardSnapshots = pgTable(
  'leaderboard_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    rank: integer('rank').notNull(),
    totalPoints: integer('total_points').notNull(),
    totalMentions: integer('total_mentions').notNull(),
    averageQuality: integer('average_quality').notNull(),
    period: text('period').notNull(), // 'daily', 'weekly', 'monthly', 'alltime'
    periodStart: timestamp('period_start').notNull(),
    periodEnd: timestamp('period_end').notNull(),
    snapshotAt: timestamp('snapshot_at').defaultNow().notNull(),
  },
  (table) => ({
    userPeriodIdx: index('user_period_idx').on(table.userId, table.period),
    periodRankIdx: index('period_rank_idx').on(table.period, table.rank),
  })
);

// ============ GENERATED IMAGES TABLE ============
export const generatedImages = pgTable(
  'generated_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
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
  },
  (table) => ({
    userIdIdx: index('gen_user_id_idx').on(table.userId),
    statusIdx: index('status_idx').on(table.status),
    replicateIdIdx: uniqueIndex('replicate_id_idx').on(table.replicateId),
  })
);

// ============ WEBHOOK EVENTS TABLE (Idempotency) ============
export const webhookEvents = pgTable(
  'webhook_events',
  {
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
  },
  (table) => ({
    webhookIdIdx: uniqueIndex('webhook_id_idx').on(table.webhookId),
    processedIdx: index('processed_idx').on(table.processed),
    receivedAtIdx: index('received_at_idx').on(table.receivedAt),
  })
);

// ============ PAYOUTS TABLE ============
export const payouts = pgTable(
  'payouts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    amount: integer('amount').notNull(), // In token smallest units
    rank: integer('rank').notNull(),
    period: text('period').notNull(),
    periodStart: timestamp('period_start').notNull(),
    periodEnd: timestamp('period_end').notNull(),
    transactionHash: text('transaction_hash'),
    status: text('status').notNull(), // 'pending', 'processing', 'completed', 'failed'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    processedAt: timestamp('processed_at'),
  },
  (table) => ({
    userIdIdx: index('payout_user_id_idx').on(table.userId),
    statusIdx: index('payout_status_idx').on(table.status),
  })
);

// ============ RELATIONS ============
export const usersRelations = relations(users, ({ many }) => ({
  mentions: many(twitterMentions),
  images: many(generatedImages),
  snapshots: many(leaderboardSnapshots),
  payouts: many(payouts),
}));

export const twitterMentionsRelations = relations(
  twitterMentions,
  ({ one }) => ({
    user: one(users, {
      fields: [twitterMentions.userId],
      references: [users.id],
    }),
  })
);

export const generatedImagesRelations = relations(
  generatedImages,
  ({ one }) => ({
    user: one(users, {
      fields: [generatedImages.userId],
      references: [users.id],
    }),
  })
);

export const leaderboardSnapshotsRelations = relations(
  leaderboardSnapshots,
  ({ one }) => ({
    user: one(users, {
      fields: [leaderboardSnapshots.userId],
      references: [users.id],
    }),
  })
);

export const payoutsRelations = relations(payouts, ({ one }) => ({
  user: one(users, {
    fields: [payouts.userId],
    references: [users.id],
  }),
}));

