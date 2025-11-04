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
            // Include page in cache key for pagination
            const cacheKey = `${RedisKeys.leaderboard(period)}:page:${page}:limit:${limit}`;
            const cached = await ctx.redis.get(cacheKey);

            if (cached) {
              console.log(`✅ Leaderboard cache HIT: ${cacheKey}`);
              return JSON.parse(cached);
            }
            console.log(`❌ Leaderboard cache MISS: ${cacheKey}`);
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
            const cacheKey = `${RedisKeys.leaderboard(period)}:page:${page}:limit:${limit}`;
            await ctx.redis.setex(cacheKey, 300, JSON.stringify(leaderboard));
            console.log(`💾 Leaderboard cached: ${cacheKey}`);
          } catch (redisError) {
            console.error('Redis cache write error:', redisError);
            // Continue without caching
          }
        }

        return leaderboard;
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        throw error;
      }
    }),

  getTopTen: publicProcedure.query(async ({ ctx }) => {
    try {
      // Check cache first
      if (ctx.redis) {
        try {
          const cacheKey = 'leaderboard:top10';
          const cached = await ctx.redis.get(cacheKey);
          
          if (cached) {
            console.log('✅ Top 10 cache HIT');
            return JSON.parse(cached);
          }
          console.log('❌ Top 10 cache MISS');
        } catch (redisError) {
          console.error('Redis cache read error:', redisError);
        }
      }

      const topTen = await ctx.db
        .select()
        .from(users)
        .orderBy(desc(users.totalOfferings))
        .limit(10);

      // Cache for 2 minutes (shorter TTL since it's on homepage)
      if (ctx.redis) {
        try {
          const cacheKey = 'leaderboard:top10';
          await ctx.redis.setex(cacheKey, 120, JSON.stringify(topTen));
          console.log('💾 Top 10 cached');
        } catch (redisError) {
          console.error('Redis cache write error:', redisError);
        }
      }

      return topTen;
    } catch (error) {
      console.error('Error fetching top ten leaderboard:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      throw error;
    }
  }),
});

