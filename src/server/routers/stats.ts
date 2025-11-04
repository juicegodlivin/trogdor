import { router, publicProcedure } from '../trpc';
import { users, generatedImages } from '@/lib/db/schema';
import { count, sum } from 'drizzle-orm';

export const statsRouter = router({
  getGlobalStats: publicProcedure.query(async ({ ctx }) => {
    try {
      // Check cache first
      if (ctx.redis) {
        try {
          const cacheKey = 'stats:global';
          const cached = await ctx.redis.get(cacheKey);
          
          if (cached) {
            console.log('✅ Global stats cache HIT');
            return JSON.parse(cached);
          }
          console.log('❌ Global stats cache MISS');
        } catch (redisError) {
          console.error('Redis cache read error:', redisError);
        }
      }

      // Get total user count
      const userCountResult = await ctx.db
        .select({ count: count() })
        .from(users);
      
      // Get sum of all offerings
      const offeringsResult = await ctx.db
        .select({ sum: sum(users.totalOfferings) })
        .from(users);
      
      // Get total images generated
      const imagesResult = await ctx.db
        .select({ count: count() })
        .from(generatedImages);

      const stats = {
        cultMembers: userCountResult[0]?.count || 0,
        totalOfferings: offeringsResult[0]?.sum || 0,
        imagesGenerated: imagesResult[0]?.count || 0,
      };

      // Cache for 1 minute (displayed on every page)
      if (ctx.redis) {
        try {
          const cacheKey = 'stats:global';
          await ctx.redis.setex(cacheKey, 60, JSON.stringify(stats));
          console.log('💾 Global stats cached');
        } catch (redisError) {
          console.error('Redis cache write error:', redisError);
        }
      }

      return stats;
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return {
        cultMembers: 0,
        totalOfferings: 0,
        imagesGenerated: 0,
      };
    }
  }),
});

