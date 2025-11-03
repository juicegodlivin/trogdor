import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { RedisKeys } from '@/lib/redis/keys';

export const leaderboardRouter = router({
  getLeaderboard: publicProcedure
    .input(
      z.object({
        period: z.enum(['alltime', 'monthly', 'weekly', 'daily']),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input, ctx }) => {
      const { period, page, limit } = input;
      const offset = (page - 1) * limit;

      // Check cache first (if Redis is available)
      if (ctx.redis) {
        const cacheKey = RedisKeys.leaderboard(period);
        const cached = await ctx.redis.get(cacheKey);

        if (cached) {
          return JSON.parse(cached);
        }
      }

      // Fetch from database
      const leaderboard = await ctx.db
        .select()
        .from(users)
        .orderBy(desc(users.totalOfferings))
        .limit(limit)
        .offset(offset);

      // Cache for 5 minutes (if Redis is available)
      if (ctx.redis) {
        const cacheKey = RedisKeys.leaderboard(period);
        await ctx.redis.setex(cacheKey, 300, JSON.stringify(leaderboard));
      }

      return leaderboard;
    }),

  getTopTen: publicProcedure.query(async ({ ctx }) => {
    const topTen = await ctx.db
      .select()
      .from(users)
      .orderBy(desc(users.totalOfferings))
      .limit(10);

    return topTen;
  }),
});

