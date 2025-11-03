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
      try {
        const { period, page, limit } = input;
        const offset = (page - 1) * limit;

        // Check cache first (if Redis is available)
        if (ctx.redis) {
          try {
            const cacheKey = RedisKeys.leaderboard(period);
            const cached = await ctx.redis.get(cacheKey);

            if (cached) {
              return JSON.parse(cached);
            }
          } catch (redisError) {
            console.error('Redis cache read error:', redisError);
            // Continue without cache
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
          try {
            const cacheKey = RedisKeys.leaderboard(period);
            await ctx.redis.setex(cacheKey, 300, JSON.stringify(leaderboard));
          } catch (redisError) {
            console.error('Redis cache write error:', redisError);
            // Continue without caching
          }
        }

        return leaderboard;
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw new Error('Failed to fetch leaderboard data');
      }
    }),

  getTopTen: publicProcedure.query(async ({ ctx }) => {
    try {
      const topTen = await ctx.db
        .select()
        .from(users)
        .orderBy(desc(users.totalOfferings))
        .limit(10);

      return topTen;
    } catch (error) {
      console.error('Error fetching top ten leaderboard:', error);
      throw new Error('Failed to fetch leaderboard data');
    }
  }),
});

