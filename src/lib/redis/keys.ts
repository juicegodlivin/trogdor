export const RedisKeys = {
  // Idempotency
  webhookEvent: (webhookId: string) => `webhook:event:${webhookId}`,
  tweetProcessed: (tweetId: string) => `tweet:processed:${tweetId}`,
  imageGeneration: (replicateId: string) => `image:gen:${replicateId}`,

  // Rate limiting
  userRateLimit: (userId: string, action: string) =>
    `rate:${action}:${userId}`,
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

