import Redis from 'ioredis';

// Redis is optional - create a mock client if not configured
let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
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

