import { TRPCError } from '@trpc/server';
import type Redis from 'ioredis';

interface RateLimitConfig {
  max: number; // Maximum requests
  windowMs: number; // Time window in milliseconds
  message?: string;
}

/**
 * Rate limit helper using Redis
 * Uses sliding window algorithm for accurate rate limiting
 */
export async function checkRateLimit(
  redis: Redis | null,
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  // If Redis is not available, allow the request (graceful degradation)
  if (!redis) {
    console.warn('Rate limiting disabled: Redis not configured');
    return { allowed: true, remaining: config.max, reset: Date.now() + config.windowMs };
  }

  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  try {
    // Use Redis sorted set for sliding window
    // Score = timestamp, member = unique request ID
    const requestId = `${now}-${Math.random()}`;
    
    // Pipeline commands for atomic execution
    const pipeline = redis.pipeline();
    
    // 1. Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // 2. Add current request
    pipeline.zadd(key, now, requestId);
    
    // 3. Count requests in window
    pipeline.zcard(key);
    
    // 4. Set expiration (cleanup)
    pipeline.expire(key, Math.ceil(config.windowMs / 1000));
    
    const results = await pipeline.exec();
    
    // Extract count from pipeline results
    // results is an array of [error, result] tuples
    const count = results?.[2]?.[1] as number || 0;
    
    const allowed = count <= config.max;
    const remaining = Math.max(0, config.max - count);
    const reset = now + config.windowMs;
    
    if (!allowed) {
      console.warn(`Rate limit exceeded for ${identifier}: ${count}/${config.max}`);
    }
    
    return { allowed, remaining, reset };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request (fail open)
    return { allowed: true, remaining: config.max, reset: Date.now() + config.windowMs };
  }
}

/**
 * Rate limit middleware for tRPC procedures
 */
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return async (opts: { ctx: any; next: any }) => {
    const { ctx, next } = opts;
    
    // Get identifier (user ID or IP address)
    const identifier = ctx.session?.user?.id 
      ? `user:${ctx.session.user.id}`
      : `ip:${ctx.ip || 'unknown'}`;
    
    const result = await checkRateLimit(ctx.redis, identifier, config);
    
    if (!result.allowed) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: config.message || `Rate limit exceeded. Please try again later.`,
      });
    }
    
    return next();
  };
}

/**
 * Predefined rate limit configs
 */
export const RateLimits = {
  // Strict: For expensive operations (image generation, AI calls)
  strict: {
    max: 10,
    windowMs: 60 * 60 * 1000, // 10 per hour
    message: 'Too many requests. Please try again in an hour.',
  },
  
  // Moderate: For mutations (create, update, delete)
  moderate: {
    max: 30,
    windowMs: 60 * 1000, // 30 per minute
    message: 'Too many requests. Please slow down.',
  },
  
  // Standard: For authenticated queries
  standard: {
    max: 100,
    windowMs: 60 * 1000, // 100 per minute
    message: 'Too many requests. Please wait a moment.',
  },
  
  // Lenient: For public queries (leaderboard, stats)
  lenient: {
    max: 300,
    windowMs: 60 * 1000, // 300 per minute
    message: 'Too many requests from your connection. Please wait.',
  },
} as const;

