import { router, publicProcedure } from '../trpc';
import { users, generatedImages } from '@/lib/db/schema';
import { count, sum } from 'drizzle-orm';

export const statsRouter = router({
  getGlobalStats: publicProcedure.query(async ({ ctx }) => {
    try {
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

      return {
        cultMembers: userCountResult[0]?.count || 0,
        totalOfferings: offeringsResult[0]?.sum || 0,
        imagesGenerated: imagesResult[0]?.count || 0,
      };
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

