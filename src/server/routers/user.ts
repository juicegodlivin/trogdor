import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { users, twitterMentions, generatedImages } from '@/lib/db/schema';
import { eq, sql, desc, ne } from 'drizzle-orm';
import { getTwitterApi } from '@/lib/api/twitter';
import { TRPCError } from '@trpc/server';
import { checkRateLimit, RateLimits } from '@/lib/rate-limit';

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
      profileImage: user.profileImage,
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
      // Rate limit: 5 Twitter linking attempts per hour
      const identifier = `user:${ctx.session.user.id}:twitter-link`;
      const rateLimitConfig = {
        max: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
        message: 'Too many Twitter linking attempts. Please try again later.',
      };
      const rateLimit = await checkRateLimit(ctx.redis, identifier, rateLimitConfig);
      
      if (!rateLimit.allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: rateLimitConfig.message || 'Rate limit exceeded',
        });
      }

      // Remove @ symbol if user included it
      const cleanUsername = input.twitterUsername.replace(/^@/, '');

      try {
        // Fetch user info from Twitter API to get their ID and profile image
        console.log(`🔍 Looking up Twitter user: @${cleanUsername}`);
        const twitterApi = getTwitterApi();
        const response = await twitterApi.getUserByUsername(cleanUsername);
        
        // Log full response for debugging
        console.log('📦 RAW TWITTER API RESPONSE:');
        console.log(JSON.stringify(response, null, 2));
        
        if (!response.data) {
          console.error('❌ No data in Twitter API response');
          throw new Error('Twitter user not found. Please check the username and try again.');
        }

        const twitterId = response.data.id;
        const twitterName = response.data.name;
        // TwitterAPI.io uses 'profilePicture' not 'profile_image_url'
        const profileImageUrl = response.data.profilePicture || response.data.profile_image_url;
        
        console.log(`✅ Twitter User Found:`);
        console.log(`   - Username: @${cleanUsername}`);
        console.log(`   - ID: ${twitterId}`);
        console.log(`   - Name: ${twitterName}`);
        console.log(`   - Profile Image URL: ${profileImageUrl || '⚠️ MISSING FROM API RESPONSE'}`);
        console.log(`   - Response Data Keys:`, Object.keys(response.data).join(', '));

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

        // Update user's Twitter info - now includes ID and profile image!
        const [updated] = await ctx.db
          .update(users)
          .set({ 
            twitterHandle: cleanUsername,
            twitterId: twitterId,
            username: twitterName || cleanUsername, // Use real name if available
            profileImage: profileImageUrl || null,
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

  // Unlink Twitter account
  unlinkTwitter: protectedProcedure.mutation(async ({ ctx }) => {
    const [updated] = await ctx.db
      .update(users)
      .set({
        twitterHandle: null,
        twitterId: null,
        profileImage: null,
      })
      .where(eq(users.id, ctx.session.user.id))
      .returning();

    console.log(`✅ Unlinked Twitter account from wallet ${ctx.session.user.walletAddress}`);

    return updated;
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
