import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { generatedImages } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import Replicate from 'replicate';
import { uploadImageFromUrl, deleteImage as deleteImageFromStorage, STORAGE_BUCKET } from '@/lib/storage';

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
// - 'juicegodlivin/trogdor-the-burninator:6919fb119839d1043e79af7530598bdc6840ea34acdcd1eabc276bbffd4db5d3' (ENHANCED v2 - Better training!)
// - 'juicegodlivin/trogdor-the-burninator:8e9dc5be7a45090d1a8aed4547c3ee717b3cfcfc55aca84108c98cf78c167291' (v1)
// - 'black-forest-labs/flux-1.1-pro' (fallback, generic)
// - 'black-forest-labs/flux-schnell' (faster, cheaper)
const GENERATION_MODEL = 'juicegodlivin/trogdor-the-burninator:6919fb119839d1043e79af7530598bdc6840ea34acdcd1eabc276bbffd4db5d3';

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

        // Build the complete prompt using your custom trained model
        // The model already knows what "Trogdor" looks like from training!
        const enhancedPrompt = `Trogdor ${input.prompt}. ${STYLE_MODIFIERS}`;

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

        // Upload image to permanent Supabase Storage
        console.log('📤 Uploading image to Supabase Storage...');
        const fileName = `${ctx.session.user.id}/${uniqueReplicateId}.png`;
        let permanentImageUrl: string;
        
        try {
          permanentImageUrl = await uploadImageFromUrl(imageUrl, fileName);
          console.log('✅ Image uploaded successfully:', permanentImageUrl);
        } catch (uploadError) {
          console.error('❌ Failed to upload to Supabase, using Replicate URL as fallback:', uploadError);
          // Fallback to Replicate URL if upload fails
          permanentImageUrl = imageUrl;
        }

        // Save to database with permanent URL
        const [generatedImage] = await ctx.db
          .insert(generatedImages)
          .values({
            userId: ctx.session.user.id,
            prompt: input.prompt,
            imageUrl: permanentImageUrl,
            replicateId: uniqueReplicateId,
            status: 'completed',
            metadata: {
              model: GENERATION_MODEL,
              parameters: {
                enhancedPrompt,
                characterDescription: TROGDOR_CHARACTER_DESCRIPTION,
                originalPrompt: input.prompt,
                replicateUrl: imageUrl, // Store original URL for reference
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

  // Delete a generated image
  deleteImage: protectedProcedure
    .input(
      z.object({
        imageId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First, check if the image belongs to the user
        const [image] = await ctx.db
          .select()
          .from(generatedImages)
          .where(eq(generatedImages.id, input.imageId))
          .limit(1);

        if (!image) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Image not found',
          });
        }

        if (image.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only delete your own images',
          });
        }

        // Delete from Supabase Storage if it's stored there
        if (image.imageUrl.includes('supabase.co')) {
          try {
            // Extract filename from URL
            const urlParts = image.imageUrl.split('/');
            const fileName = urlParts.slice(-2).join('/'); // Get userId/filename.png
            await deleteImageFromStorage(fileName);
            console.log('✅ Deleted from Supabase Storage:', fileName);
          } catch (storageError) {
            console.error('⚠️ Failed to delete from storage (continuing):', storageError);
            // Don't fail the whole operation if storage delete fails
          }
        }

        // Delete from database
        await ctx.db
          .delete(generatedImages)
          .where(eq(generatedImages.id, input.imageId));

        // Remove from Redis cache if exists
        if (ctx.redis) {
          const cacheKey = `generated:${input.imageId}`;
          await ctx.redis.del(cacheKey);
        }

        return { success: true };
      } catch (error) {
        console.error('Delete image error:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete image',
        });
      }
    }),
});

