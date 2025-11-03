# TROGDOR BURNINATOR - QUICK START GUIDE

## IMPLEMENTATION ROADMAP

This guide provides step-by-step instructions to build the Trogdor the Burninator cult website from scratch.

---

## PHASE 1: PROJECT INITIALIZATION (Day 1)

### Step 1: Create Next.js Project

```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest trogdor-burninator --typescript --tailwind --app --src-dir

cd trogdor-burninator

# Install core dependencies
npm install \
  drizzle-orm postgres \
  @auth/core next-auth@beta \
  @tanstack/react-query @trpc/client @trpc/server @trpc/react-query @trpc/next \
  zod \
  axios \
  ioredis \
  @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js \
  replicate \
  bs58 @noble/ed25519 \
  framer-motion \
  lucide-react

# Install dev dependencies
npm install -D \
  drizzle-kit \
  @types/node \
  prettier prettier-plugin-tailwindcss \
  eslint-config-prettier
```

### Step 2: Setup Environment Variables

```bash
# Create .env.local file
cp .env.local.example .env.local

# Fill in with your credentials
# See TROGDOR_PROJECT_CONTEXT.md for full list
```

### Step 3: Initialize Database

```bash
# Setup Supabase (recommended) or Neon
# Option A: Supabase
npx supabase init
npx supabase start

# Option B: Neon
# Sign up at neon.tech, create project, copy connection string

# Generate Drizzle config
cat > drizzle.config.ts << 'EOF'
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
EOF
```

### Step 4: Create Database Schema

```bash
# Copy schema from TROGDOR_PROJECT_CONTEXT.md to src/lib/db/schema.ts

# Generate initial migration
npx drizzle-kit generate:pg

# Run migration
npx drizzle-kit push:pg
```

### Step 5: Setup Redis

```bash
# Option A: Local development
# Install Redis locally
brew install redis  # macOS
# or
sudo apt-get install redis-server  # Ubuntu

redis-server

# Option B: Upstash (recommended for production)
# Sign up at upstash.com
# Create Redis database
# Copy connection string to .env.local
```

---

## PHASE 2: AUTHENTICATION & WEB3 (Days 2-3)

### Step 1: Configure NextAuth

```bash
# Create auth config
mkdir -p src/lib/auth
touch src/lib/auth/config.ts src/lib/auth/providers.ts
```

```typescript
// src/lib/auth/config.ts
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyWalletSignature } from '../api/web3';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: 'solana',
      name: 'Solana Wallet',
      credentials: {
        address: { label: 'Address', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        message: { label: 'Message', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature || !credentials?.message) {
          return null;
        }

        const isValid = await verifyWalletSignature(
          credentials.address as string,
          credentials.signature as string,
          credentials.message as string
        );

        if (!isValid) return null;

        // Find or create user
        const user = await db.query.users.findFirst({
          where: eq(users.walletAddress, credentials.address),
        });

        if (!user) {
          const [newUser] = await db.insert(users).values({
            walletAddress: credentials.address as string,
          }).returning();
          return { id: newUser.id, address: newUser.walletAddress };
        }

        return { id: user.id, address: user.walletAddress };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.address = token.address as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
```

### Step 2: Create Wallet Connect Component

```bash
mkdir -p src/components/web3
touch src/components/web3/WalletConnect.tsx
```

Copy WalletConnect component from UI_SPECIFICATIONS.md

### Step 3: Setup tRPC

```bash
mkdir -p src/server/routers
touch src/server/context.ts src/server/index.ts
touch src/server/routers/user.ts
```

```typescript
// src/server/context.ts
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function createContext() {
  const session = await getServerSession(authConfig);
  return {
    session,
    db,
    redis,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

```typescript
// src/server/index.ts
import { initTRPC } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
```

---

## PHASE 3: TWITTER INTEGRATION (Days 4-5)

### Step 1: Setup Twitter Client

```bash
# Install Twitter API client
npm install twitter-api-v2

# Create Twitter API wrapper
mkdir -p src/lib/api
touch src/lib/api/twitter.ts
```

Copy Twitter client code from PROJECT_CONTEXT.md

### Step 2: Create Webhook Endpoint

```bash
# Create webhook route
mkdir -p app/api/webhooks/twitter
touch app/api/webhooks/twitter/route.ts
```

Copy webhook handler from PROJECT_CONTEXT.md

### Step 3: Register Webhook with Twitter

```bash
# Create setup script
touch scripts/setup-webhooks.ts
```

```typescript
// scripts/setup-webhooks.ts
import { TwitterClient } from '@/lib/api/twitter';

async function setupWebhook() {
  const client = new TwitterClient();
  const webhookUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/api/webhooks/twitter`
    : 'http://localhost:3000/api/webhooks/twitter';
  
  console.log('Setting up webhook at:', webhookUrl);
  
  const response = await client.setupWebhook(webhookUrl);
  console.log('Webhook registered:', response);
}

setupWebhook().catch(console.error);
```

```bash
# Run setup
npx tsx scripts/setup-webhooks.ts
```

### Step 4: Test Webhook

```bash
# Use ngrok for local testing
ngrok http 3000

# Update webhook URL to ngrok URL
# Post a test tweet mentioning your project
# Check webhook logs
```

---

## PHASE 4: AI IMAGE GENERATION (Day 6)

### Step 1: Setup Replicate

```bash
# Install Replicate SDK
npm install replicate

# Create Replicate client
touch src/lib/api/replicate.ts
```

Copy Replicate client from PROJECT_CONTEXT.md

### Step 2: Create Generator API Route

```bash
touch src/server/routers/generator.ts
```

```typescript
// src/server/routers/generator.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { generateTrogdorImage } from '@/lib/api/replicate';
import { TRPCError } from '@trpc/server';

export const generatorRouter = router({
  generate: protectedProcedure
    .input(z.object({
      prompt: z.string().min(10).max(500),
      style: z.enum(['village', 'modern', 'metal', 'abstract']).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Rate limit check
      const rateKey = `rate:generate:${ctx.session.user.id}`;
      const count = await ctx.redis.incr(rateKey);
      
      if (count === 1) {
        await ctx.redis.expire(rateKey, 3600); // 1 hour
      }
      
      if (count > 5) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded. Try again in 1 hour.',
        });
      }
      
      // Generate image
      const prediction = await generateTrogdorImage(
        input.prompt,
        ctx.session.user.id
      );
      
      return { predictionId: prediction.id };
    }),
  
  checkStatus: protectedProcedure
    .input(z.object({ predictionId: z.string() }))
    .query(async ({ input }) => {
      const status = await checkGenerationStatus(input.predictionId);
      return status;
    }),
});
```

### Step 3: Create Generator UI

```bash
mkdir -p app/(main)/generator
touch app/(main)/generator/page.tsx
```

Copy Generator components from UI_SPECIFICATIONS.md

---

## PHASE 5: LEADERBOARD SYSTEM (Days 7-8)

### Step 1: Create Scoring Function

```bash
touch src/lib/utils/scoring.ts
```

Copy scoring algorithm from PROJECT_CONTEXT.md

### Step 2: Create Leaderboard Router

```bash
touch src/server/routers/leaderboard.ts
```

```typescript
// src/server/routers/leaderboard.ts
import { z } from 'zod';
import { router, publicProcedure } from '../index';
import { desc, eq, and, gte, lte } from 'drizzle-orm';
import { users, leaderboardSnapshots } from '@/lib/db/schema';

export const leaderboardRouter = router({
  getLeaderboard: publicProcedure
    .input(z.object({
      period: z.enum(['alltime', 'monthly', 'weekly', 'daily']),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input, ctx }) => {
      const { period, page, limit } = input;
      const offset = (page - 1) * limit;
      
      // Check cache first
      const cacheKey = RedisKeys.leaderboard(period);
      const cached = await ctx.redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Fetch from database
      let query;
      
      if (period === 'alltime') {
        query = ctx.db
          .select()
          .from(users)
          .orderBy(desc(users.totalOfferings))
          .limit(limit)
          .offset(offset);
      } else {
        const now = new Date();
        let startDate: Date;
        
        switch (period) {
          case 'daily':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'weekly':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'monthly':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        }
        
        query = ctx.db
          .select()
          .from(leaderboardSnapshots)
          .where(
            and(
              eq(leaderboardSnapshots.period, period),
              gte(leaderboardSnapshots.periodStart, startDate)
            )
          )
          .orderBy(desc(leaderboardSnapshots.totalPoints))
          .limit(limit)
          .offset(offset);
      }
      
      const result = await query;
      
      // Cache for 5 minutes
      await ctx.redis.setex(cacheKey, 300, JSON.stringify(result));
      
      return result;
    }),
  
  searchUser: publicProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ input, ctx }) => {
      const results = await ctx.db
        .select()
        .from(users)
        .where(
          or(
            like(users.username, `%${input.query}%`),
            like(users.walletAddress, `%${input.query}%`),
            like(users.twitterHandle, `%${input.query}%`)
          )
        )
        .limit(10);
      
      return results;
    }),
});
```

### Step 3: Create Leaderboard Page

```bash
mkdir -p app/(main)/leaderboard
touch app/(main)/leaderboard/page.tsx
```

Copy Leaderboard components from UI_SPECIFICATIONS.md

### Step 4: Setup Cron Jobs

```bash
# Create cron routes
mkdir -p app/api/cron
touch app/api/cron/leaderboard-refresh/route.ts
```

```typescript
// app/api/cron/leaderboard-refresh/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, leaderboardSnapshots } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get top 100 users
    const topUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.totalOfferings))
      .limit(100);
    
    // Create snapshots
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - 7));
    
    for (let i = 0; i < topUsers.length; i++) {
      await db.insert(leaderboardSnapshots).values({
        userId: topUsers[i].id,
        rank: i + 1,
        totalPoints: topUsers[i].totalOfferings,
        totalMentions: topUsers[i].totalMentions || 0,
        averageQuality: 75, // Calculate from mentions
        period: 'weekly',
        periodStart: startOfWeek,
        periodEnd: now,
      });
    }
    
    return NextResponse.json({ success: true, count: topUsers.length });
  } catch (error) {
    console.error('Leaderboard refresh failed:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

```bash
# Setup Vercel Cron
# Add to vercel.json
cat > vercel.json << 'EOF'
{
  "crons": [{
    "path": "/api/cron/leaderboard-refresh",
    "schedule": "*/5 * * * *"
  }]
}
EOF
```

---

## PHASE 6: DESIGN SYSTEM (Days 9-10)

### Step 1: Configure Tailwind

```bash
# Copy Tailwind config from PROJECT_CONTEXT.md
# Update tailwind.config.ts
```

### Step 2: Create Global Styles

```bash
# Copy CSS from UI_SPECIFICATIONS.md to app/globals.css
```

### Step 3: Install Fonts

```bash
# Install Google Fonts
npm install @next/font

# Create font config
touch src/config/fonts.ts
```

```typescript
// src/config/fonts.ts
import { Inter, Caveat, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '700'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});
```

```typescript
// Update app/layout.tsx
import { inter, caveat, jetbrainsMono } from '@/config/fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Step 4: Create Shared Components

```bash
mkdir -p src/components/ui src/components/layout
```

Copy components from UI_SPECIFICATIONS.md:
- Header
- Footer
- LoadingSpinner
- Toast
- etc.

---

## PHASE 7: CONTENT PAGES (Day 11)

### Step 1: Create Landing Page

```bash
# Copy from UI_SPECIFICATIONS.md
# Update app/page.tsx
```

### Step 2: Create History Page

```bash
mkdir -p app/(main)/history
touch app/(main)/history/page.tsx
```

Use research from TROGDOR_RESEARCH.md for content

### Step 3: Create Products Page

```bash
mkdir -p app/(main)/products
touch app/(main)/products/page.tsx
```

---

## PHASE 8: TESTING & QA (Day 12)

### Step 1: Manual Testing Checklist

```markdown
- [ ] Wallet connection works
- [ ] User can sign message and authenticate
- [ ] Twitter linking flow works
- [ ] Webhook receives mentions
- [ ] Points are awarded correctly
- [ ] Leaderboard updates
- [ ] Image generation works
- [ ] Download/share images works
- [ ] Mobile responsive
- [ ] All pages load
```

### Step 2: Load Testing

```bash
# Install Artillery
npm install -g artillery

# Create load test
cat > load-test.yml << 'EOF'
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: Browse pages
    flow:
      - get:
          url: '/'
      - get:
          url: '/leaderboard'
      - get:
          url: '/history'
EOF

# Run test
artillery run load-test.yml
```

---

## PHASE 9: DEPLOYMENT (Day 13)

### Step 1: Prepare for Deployment

```bash
# Build locally first
npm run build

# Test production build
npm run start
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### Step 3: Configure Environment Variables

```bash
# In Vercel Dashboard:
# Settings > Environment Variables
# Add all variables from .env.local
```

### Step 4: Setup Custom Domain

```bash
# In Vercel Dashboard:
# Settings > Domains
# Add your domain
# Configure DNS
```

### Step 5: Monitor Deployment

```bash
# Check deployment logs
vercel logs

# Setup Sentry
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## PHASE 10: POST-LAUNCH (Week 3+)

### Monitoring Setup

```bash
# Setup uptime monitoring (BetterStack/UptimeRobot)
# Setup error tracking (Sentry)
# Setup analytics (PostHog)
```

### Performance Optimization

```bash
# Run Lighthouse
npm install -g lighthouse
lighthouse https://your-domain.com --view

# Optimize images
npm install sharp
# Use Next.js Image component everywhere
```

### Security Audit

```bash
# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

---

## DEVELOPMENT WORKFLOW

### Daily Development

```bash
# Start dev server
npm run dev

# In separate terminal: Watch database
npx drizzle-kit studio

# In another terminal: Redis CLI
redis-cli

# Check logs
tail -f .next/trace
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/leaderboard-ui

# Make changes
git add .
git commit -m "feat: add leaderboard pagination"

# Push
git push origin feature/leaderboard-ui

# Vercel auto-deploys preview
```

### Database Migrations

```bash
# After changing schema
npx drizzle-kit generate:pg

# Review migration in src/lib/db/migrations

# Apply migration
npx drizzle-kit push:pg

# Or run specific migration
npm run db:migrate
```

---

## USEFUL COMMANDS

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

# Database
npm run db:generate      # Generate migration
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database

# Deployment
npm run deploy:preview   # Deploy preview
npm run deploy:prod      # Deploy production

# Utilities
npm run setup:webhooks   # Register Twitter webhooks
npm run setup:cron       # Setup cron jobs
npm run check:all        # Run all checks (type, lint, build)
```

---

## TROUBLESHOOTING

### Common Issues

**1. Database connection fails**
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**2. Redis connection fails**
```bash
# Check Redis is running
redis-cli ping

# Should return PONG
```

**3. Webhook not receiving events**
```bash
# Check webhook registration
curl https://api.twitter.com/2/webhooks

# Re-register webhook
npm run setup:webhooks
```

**4. Image generation stuck**
```bash
# Check Replicate status
curl https://api.replicate.com/v1/predictions/PREDICTION_ID

# Clear Redis queue
redis-cli DEL queue:image:generation
```

**5. Build fails**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## COST ESTIMATES

### Monthly Operating Costs (est.)

- **Vercel Pro**: $20/month (includes hosting, bandwidth, functions)
- **Supabase Pro**: $25/month (includes database, auth, storage)
- **Upstash Redis**: $10/month (pay-as-you-go)
- **Replicate**: ~$50-200/month (depending on image generation volume)
- **Twitter API**: Free (Basic tier) or $100/month (Pro)
- **Domain**: $12/year

**Total**: ~$100-300/month

### Cost Optimization Tips

1. Use Vercel Hobby tier initially (free)
2. Self-host Redis with Railway ($5/month)
3. Implement aggressive caching
4. Rate limit image generation heavily
5. Use CDN for image delivery (Cloudflare R2)

---

## PERFORMANCE BENCHMARKS

Target metrics after optimization:

- **Homepage load**: <1.5s
- **API response time**: <200ms (cached), <800ms (uncached)
- **Image generation**: 10-30s (Replicate dependent)
- **Database queries**: <50ms
- **Redis operations**: <5ms

---

## CURSOR AI PROMPTING TIPS

When asking Cursor to generate code:

**Good prompts:**
```
"Create a React component for the leaderboard table following the hand-drawn 
aesthetic defined in our design system. Use the border-sketch and 
notebook-paper classes. Include ranking, user info, offerings count, and 
quality score. Make it responsive."
```

**Bad prompts:**
```
"Make a leaderboard"
```

**Key tips:**
1. Reference specific files: "Follow the schema in src/lib/db/schema.ts"
2. Reference design system: "Use our Excalidraw aesthetic"
3. Be specific about types: "Return a Promise<User[]>"
4. Include error handling: "Wrap in try-catch with proper error messages"
5. Request tests: "Include unit tests for this function"

---

## NEXT STEPS AFTER MVP

1. **Week 1-2**: Launch MVP, gather feedback
2. **Week 3**: Implement payout system
3. **Week 4**: Add achievement badges
4. **Month 2**: Build mobile app (React Native)
5. **Month 3**: DAO governance features
6. **Month 4+**: NFT minting, merchandise store

---

This quick-start guide should get you from zero to deployed MVP in about 2 weeks of focused development. Remember: ship fast, iterate based on community feedback, and always maintain the crude hand-drawn aesthetic - it's what makes Trogdor special! 🔥🐉
