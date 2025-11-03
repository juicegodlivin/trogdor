# 🔥 ENVIRONMENT SETUP GUIDE

## Quick Start

Create a file called `.env.local` in the root directory with these contents:

```bash
# Copy everything below this line into your .env.local file
# =============================================================================

# DATABASE (Supabase) - REQUIRED
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# AUTHENTICATION - REQUIRED
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ZmY4NzJkMTNhYWU0NGJiYzk3MWE4ZDJkYzYzZTRmNzY="

# SOLANA RPC - REQUIRED
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# RATE LIMITING - REQUIRED
RATE_LIMIT_ENABLED="true"
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="3600000"
CRON_SECRET="trogdor-burninate-secret-2025"

# OPTIONAL (leave empty for now, we'll add these later)
REDIS_URL=""
TWITTER_API_KEY=""
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""
TWITTER_REDIRECT_URI="http://localhost:3000/api/auth/callback/twitter"
TWITTER_WEBHOOK_SECRET=""
REPLICATE_API_TOKEN=""
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_R2_ACCESS_KEY=""
CLOUDFLARE_R2_SECRET_KEY=""
CLOUDFLARE_R2_BUCKET="trogdor-images"
```

## 📋 Step-by-Step Setup

### 1. Get Supabase Database URL (REQUIRED)

1. Go to: https://supabase.com/dashboard
2. Click on your project
3. Go to: **Settings** → **Database**
4. Scroll to **Connection string**
5. Copy the **URI** format string
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. Paste into both `DATABASE_URL` and `DIRECT_URL`

Example:
```
DATABASE_URL="postgresql://postgres:your-password@db.abcdefghijk.supabase.co:5432/postgres"
```

### 2. Run Database Migrations

Once you have your DATABASE_URL set up:

```bash
npm run db:migrate
```

This will create all the tables (users, twitter_mentions, leaderboard_snapshots, etc.)

### 3. Test the App

```bash
npm run dev
```

Open: http://localhost:3000

You should see:
- ✅ Homepage loads with Trogdor branding
- ✅ Leaderboard page shows "No cultists yet"
- ✅ No errors in console

## 🎯 What Works Now vs Later

### ✅ Works Now (Minimal Setup)
- Landing page with hand-drawn aesthetic
- Navigation between pages
- Leaderboard page (empty but functional)
- tRPC API ready

### ⏳ Need Later (When We Build Features)
- **Redis** - For caching & rate limiting (optional but recommended)
- **Twitter API** - For mention tracking & points
- **Replicate** - For AI image generation
- **Cloudflare R2** - For image storage

## 🚨 Common Issues

### "Error: DATABASE_URL is not set"
- Make sure `.env.local` exists in the root directory
- Check that `DATABASE_URL` is not empty
- Restart the dev server after adding env variables

### "Cannot connect to database"
- Verify your Supabase password is correct
- Check your project is not paused (free tier pauses after 1 week)
- Make sure you're using the connection string, not the direct postgres URL

### "Redis Client Error"
- This is okay for now! The app will skip Redis features if not configured
- Comment out or remove `REDIS_URL` line if you see errors

## 🎉 You're Ready!

Once you have:
- ✅ `.env.local` created
- ✅ `DATABASE_URL` set with your Supabase credentials
- ✅ `npm run db:migrate` completed successfully

You're ready to continue building! The site will work and we can add the other services as we implement those features.

