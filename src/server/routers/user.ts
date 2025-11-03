import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { users, twitterMentions, generatedImages } from '@/lib/db/schema';
import { eq, sql, desc, ne } from 'drizzle-orm';
import { getTwitterApi } from '@/lib/api/twitter';

export const userRouter = router({
  // Get user profile with stats
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user data
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    // Get total mentions count
    const [mentionsCount] = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(twitterMentions)
      .where(eq(twitterMentions.userId, userId));

    // Get average score
    const [avgScore] = await ctx.db
      .select({ avg: sql<number>`avg(${twitterMentions.qualityScore})::numeric` })
      .from(twitterMentions)
      .where(eq(twitterMentions.userId, userId));

    // Get total images generated
    const [imagesCount] = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(generatedImages)
      .where(eq(generatedImages.userId, userId));

    // Get recent mentions (last 5)
    const recentMentions = await ctx.db
      .select()
      .from(twitterMentions)
      .where(eq(twitterMentions.userId, userId))
      .orderBy(desc(twitterMentions.createdAt))
      .limit(5);

    // Calculate rank (simplified - could be optimized with a subquery)
    const [rankResult] = await ctx.db
      .select({
        rank: sql<number>`
          (SELECT COUNT(*) + 1 FROM users u2 
           WHERE u2.total_offerings > users.total_offerings 
           AND users.id = ${userId})::int
        `,
      })
      .from(users)
      .limit(1);

    return {
      id: user.id,
      walletAddress: user.walletAddress,
      username: user.username,
      twitterId: user.twitterId,
      twitterUsername: user.twitterHandle,
      totalScore: user.totalOfferings,
      totalMentions: mentionsCount?.count || 0,
      averageScore: avgScore?.avg ? parseFloat(avgScore.avg.toString()) : 0,
      totalImages: imagesCount?.count || 0,
      rank: rankResult?.rank || null,
      recentMentions,
      createdAt: user.joinedAt,
    };
  }),

  // Update username
  updateUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({ username: input.username })
        .where(eq(users.id, ctx.session.user.id))
        .returning();

      return updated;
    }),

  // Link Twitter username
  linkTwitter: protectedProcedure
    .input(
      z.object({
        twitterUsername: z.string().min(1).max(16).regex(/^@?[a-zA-Z0-9_]+$/, 'Invalid Twitter username'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Remove @ symbol if user included it
      const cleanUsername = input.twitterUsername.replace(/^@/, '');

      try {
        // Fetch user info from Twitter API to get their ID
        console.log(`🔍 Looking up Twitter user: @${cleanUsername}`);
        const twitterApi = getTwitterApi();
        const response = await twitterApi.getUserByUsername(cleanUsername);
        
        if (!response.data) {
          throw new Error('Twitter user not found. Please check the username and try again.');
        }

        const twitterId = response.data.id;
        const twitterName = response.data.name;
        
        console.log(`✅ Found Twitter user: @${cleanUsername} (ID: ${twitterId})`);

        // Check if this Twitter ID is already linked to another wallet
        const existingUserWithId = await ctx.db
          .select()
          .from(users)
          .where(eq(users.twitterId, twitterId))
          .limit(1);

        if (existingUserWithId.length > 0 && existingUserWithId[0].id !== ctx.session.user.id) {
          throw new Error('This Twitter account is already linked to another wallet');
        }

        // Check if username is already taken by another user (legacy check)
        const existingUsers = await ctx.db
          .select()
          .from(users)
          .where(eq(users.twitterHandle, cleanUsername))
          .limit(2);
        
        const existingUser = existingUsers.find(u => u.id !== ctx.session.user.id);

        if (existingUser && existingUser.twitterId !== twitterId) {
          throw new Error('This Twitter username is already linked to another wallet');
        }

        // Update user's Twitter info - now includes ID!
        const [updated] = await ctx.db
          .update(users)
          .set({ 
            twitterHandle: cleanUsername,
            twitterId: twitterId,
            username: twitterName || cleanUsername, // Use real name if available
          })
          .where(eq(users.id, ctx.session.user.id))
          .returning();

        console.log(`✅ Linked Twitter account @${cleanUsername} to wallet ${ctx.session.user.walletAddress}`);

        return updated;
      } catch (error: any) {
        console.error('Twitter linking error:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('not found') || error.message.includes('Not Found')) {
          throw new Error(`Twitter user @${cleanUsername} not found. Please check the username.`);
        }
        
        if (error.message.includes('already linked')) {
          throw error; // Pass through our custom error
        }
        
        throw new Error('Failed to link Twitter account. Please try again.');
      }
    }),

  // Get user's leaderboard position
  getLeaderboardPosition: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user's rank in all-time leaderboard
    const [user] = await ctx.db
      .select({
        totalScore: users.totalOfferings,
        rank: sql<number>`
          (SELECT COUNT(*) + 1 FROM users u2 
           WHERE u2.total_offerings > users.total_offerings 
           AND users.id = ${userId})::int
        `,
      })
      .from(users)
      .limit(1);

    return {
      rank: user?.rank || null,
      score: user?.totalScore || 0,
    };
  }),
});
