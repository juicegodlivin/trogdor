import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { generatedImages } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import Replicate from 'replicate';

// Log to verify token is loaded (will show in server console)
console.log('Replicate API Token loaded:', process.env.REPLICATE_API_TOKEN ? 'Yes' : 'No');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// ============ GENERATOR CONFIGURATION ============
// Easy to tune these settings for better Trogdor consistency

const TROGDOR_CHARACTER_DESCRIPTION = `Trogdor the Burninator, a green S-shaped dragon with a single muscular arm emerging from the back, consummate V-shaped spikes down the spine, sharp white teeth, breathing bright orange and yellow flames`;

const STYLE_MODIFIERS = `Hand-drawn cartoon style, bold black outlines, vibrant colors, simple shapes, comic book illustration, dynamic action scene, flames and fire effects`;

// Model Options:
// - 'black-forest-labs/flux-1.1-pro' (current, best quality & prompt adherence)
// - 'black-forest-labs/flux-schnell' (faster, cheaper)
// - 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b' (fallback)
const GENERATION_MODEL = 'black-forest-labs/flux-1.1-pro';

// ================================================

export const generatorRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(3).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Rate limiting check with Redis
        if (ctx.redis) {
          const rateLimitKey = `ratelimit:generate:${ctx.session.user.id}`;
          const requestCount = await ctx.redis.incr(rateLimitKey);
          
          if (requestCount === 1) {
            // First request, set expiry to 1 hour
            await ctx.redis.expire(rateLimitKey, 3600);
          }
          
          if (requestCount > 10) {
            throw new TRPCError({
              code: 'TOO_MANY_REQUESTS',
              message: 'You can only generate 10 images per hour. Slow down there, burninator!',
            });
          }
        }

        // Build the complete prompt with character consistency
        const enhancedPrompt = `${TROGDOR_CHARACTER_DESCRIPTION}, ${input.prompt}. ${STYLE_MODIFIERS}`;

        // Call Replicate API
        const output = await replicate.run(
          GENERATION_MODEL,
          {
            input: {
              prompt: enhancedPrompt,
              aspect_ratio: '1:1',
              output_format: 'png',
              output_quality: 90,
              safety_tolerance: 2,
            },
          }
        );

        // Flux returns a single URL string, not an array
        let imageUrl: string;
        if (typeof output === 'string') {
          imageUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
          imageUrl = output[0];
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to generate image. The dragon is sleeping.',
          });
        }

        // Generate unique replicate ID (Flux doesn't return a prediction ID in sync mode)
        const uniqueReplicateId = `flux-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Save to database
        const [generatedImage] = await ctx.db
          .insert(generatedImages)
          .values({
            userId: ctx.session.user.id,
            prompt: input.prompt,
            imageUrl,
            replicateId: uniqueReplicateId,
            status: 'completed',
            metadata: {
              model: GENERATION_MODEL,
              parameters: {
                enhancedPrompt,
                characterDescription: TROGDOR_CHARACTER_DESCRIPTION,
                originalPrompt: input.prompt,
              },
            },
          })
          .returning();

        // Cache the generation in Redis
        if (ctx.redis) {
          const cacheKey = `generated:${generatedImage.id}`;
          await ctx.redis.setex(
            cacheKey,
            86400, // 24 hours
            JSON.stringify(generatedImage)
          );
        }

        return {
          id: generatedImage.id,
          imageUrl: generatedImage.imageUrl,
          prompt: input.prompt,
        };
      } catch (error) {
        console.error('Image generation error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        // Provide more detailed error message for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Actual error message:', errorMessage);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to summon Trogdor: ${errorMessage}`,
        });
      }
    }),

  // Get user's generation history
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const images = await ctx.db
        .select()
        .from(generatedImages)
        .where(eq(generatedImages.userId, ctx.session.user.id))
        .orderBy(desc(generatedImages.generatedAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        images,
        hasMore: images.length === input.limit,
      };
    }),
});

