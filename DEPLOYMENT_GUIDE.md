# 🔥 Trogdor Deployment Guide

## Prerequisites

1. **Vercel Account** - https://vercel.com
2. **GitHub Repository** - Push your code to GitHub
3. **All Environment Variables** - See below

---

## Step 1: Prepare Environment Variables

Create a file locally with all your production values:

```bash
# Database (Supabase) - IMPORTANT: Use SESSION POOLER mode
# Go to Supabase → Settings → Database → Connection Pooling → Session mode
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Redis (Upstash)
REDIS_URL="rediss://default:[PASSWORD]@[INSTANCE].upstash.io:6379"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Replicate AI
REPLICATE_API_KEY="r8_your_replicate_key"

# Twitter Webhooks
TWITTER_WEBHOOK_SECRET="generate-with: openssl rand -hex 32"

# Solana (Production)
NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
# Or use a paid RPC like Helius/QuickNode for better performance
```

---

## Step 2: Deploy to Vercel

### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add NEXTAUTH_SECRET
vercel env add REPLICATE_API_KEY
vercel env add TWITTER_WEBHOOK_SECRET

# Redeploy with env vars
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Root Directory**: `./`

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your list
   - Select "Production", "Preview", and "Development"

5. Click "Deploy"

---

## Step 3: Database Migrations

Run migrations on your production database:

```bash
# Generate migrations
npm run db:generate

# Push to production database
DATABASE_URL="your-production-url" npm run db:push
```

---

## Step 4: Configure Twitter Webhooks

1. **Twitter Developer Portal**: https://developer.twitter.com
2. Create a new App (if you haven't already)
3. Go to "App Settings" → "Webhooks"
4. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/twitter`
5. Twitter will send a CRC challenge - your endpoint handles this automatically
6. Subscribe to "Tweet mentions" events

---

## Step 5: Custom Domain (Optional)

1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Redeploy

---

## Step 6: Performance Optimization

### Use Premium RPC Provider

Replace the free Solana RPC with a paid provider for production:

**Options:**
- **Helius**: https://helius.dev (Recommended)
- **QuickNode**: https://quicknode.com
- **Alchemy**: https://alchemy.com

```bash
# Update in Vercel
NEXT_PUBLIC_SOLANA_RPC_URL="https://mainnet.helius-rpc.com/?api-key=YOUR_KEY"
```

### Enable Redis Caching

Ensure your Redis connection is stable:
```bash
# Verify connection
vercel logs [deployment-url]
```

### Monitor Performance

- Use Vercel Analytics (built-in)
- Monitor Supabase queries
- Check Upstash Redis metrics

---

## Step 7: Post-Deployment Checklist

- [ ] Test wallet connection on production
- [ ] Generate a test image
- [ ] Verify leaderboard loads
- [ ] Test Twitter webhook with a test mention
- [ ] Check all pages render correctly
- [ ] Verify session persistence
- [ ] Test on mobile devices

---

## Troubleshooting

### Database Connection Issues

**CRITICAL: Use Session Pooler, NOT Transaction Pooler**

Transaction pooler does NOT support CREATE TABLE and other DDL operations. You'll get misleading "Tenant or user not found" errors.

**Correct setup:**
1. Go to Supabase Dashboard → Settings → Database → Connection Pooling
2. Select **"Session"** mode (NOT Transaction)
3. Copy the connection string
4. Use that in Vercel

```bash
# Test connection locally
DATABASE_URL="your-session-pooler-url" npm run db:migrate-prod

# Check Vercel logs
vercel logs --follow
```

### NextAuth Session Issues

- Ensure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain exactly
- Check that cookies are being set (DevTools → Application → Cookies)

### Redis Connection Fails

- Verify `REDIS_URL` format: `rediss://` (with SSL)
- Check Upstash dashboard for connection errors
- Redis is optional - app will work without it (just slower)

### Twitter Webhook Not Receiving Events

- Verify webhook URL is accessible (not localhost)
- Check Twitter Developer Portal for delivery errors
- Test with `curl` to your webhook endpoint
- Verify signature in logs

---

## Monitoring & Logs

```bash
# View real-time logs
vercel logs --follow

# View specific deployment logs
vercel logs [deployment-url]

# Check build logs
# Go to Vercel Dashboard → Deployments → [Select deployment] → Build Logs
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | Supabase PostgreSQL connection (use pooler with `?pgbouncer=true&prepare=false`) |
| `REDIS_URL` | ⚠️ Optional | Upstash Redis (app works without it, but slower) |
| `NEXTAUTH_URL` | ✅ Yes | Your production URL (must match exactly) |
| `NEXTAUTH_SECRET` | ✅ Yes | Random 32-byte string for JWT encryption |
| `REPLICATE_API_KEY` | ✅ Yes | For AI image generation |
| `TWITTER_WEBHOOK_SECRET` | ⚠️ Optional | For webhook signature verification |
| `NEXT_PUBLIC_SOLANA_NETWORK` | ✅ Yes | `mainnet-beta` for production |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | ✅ Yes | Solana RPC endpoint (use paid provider for production) |

---

## Costs Estimate

**Free Tier:**
- Vercel: Free (Hobby plan)
- Supabase: Free up to 500MB database
- Upstash: Free tier (10K commands/day)
- Solana RPC (public): Free but rate-limited

**Recommended Production (estimate):**
- Vercel Pro: $20/month (optional, for better performance)
- Supabase Pro: $25/month (for scaling)
- Upstash: $10-30/month (based on usage)
- Helius RPC: $50/month (for reliable Solana access)
- Replicate: Pay-per-generation (~$0.002 per image)

**Total**: ~$100-150/month for production-ready setup

---

## 🔥 You're Ready to Burninate!

Your Trogdor cult is now live and immortalized on the blockchain. May the burnination be eternal!

For issues, check Vercel logs and Supabase logs first. The most common issues are env vars and database connection strings.

