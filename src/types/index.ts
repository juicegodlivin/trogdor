import { type InferSelectModel } from 'drizzle-orm';
import * as schema from '@/lib/db/schema';

export type User = InferSelectModel<typeof schema.users>;
export type TwitterMention = InferSelectModel<typeof schema.twitterMentions>;
export type LeaderboardSnapshot = InferSelectModel<
  typeof schema.leaderboardSnapshots
>;
export type GeneratedImage = InferSelectModel<typeof schema.generatedImages>;
export type WebhookEvent = InferSelectModel<typeof schema.webhookEvents>;
export type Payout = InferSelectModel<typeof schema.payouts>;

