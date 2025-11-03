import Redis from 'ioredis';

// Redis is optional - create a mock client if not configured
let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false, // Disable for serverless
    lazyConnect: false, // Connect immediately
    retryStrategy(times) {
      if (times > 3) {
        console.error('Redis connection failed after 3 retries');
        return null; // Stop retrying
      }
      return Math.min(times * 100, 3000);
    },
  });

  redis.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  redis.on('connect', () => {
    console.log('Redis Client Connected');
  });
} else {
  console.warn('⚠️  Redis not configured - caching and rate limiting will be disabled');
}

// Export redis client or mock
export { redis };

