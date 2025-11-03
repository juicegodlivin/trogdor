# 🔥 Trogdor Deployment Post-Mortem

**Date:** November 3, 2025  
**Deployment:** Vercel Production  
**Status:** ✅ RESOLVED

---

## Executive Summary

The initial Vercel deployment failed with multiple 500 errors due to:
1. **Critical:** Using Supabase Transaction Pooler for DDL operations (not supported)
2. Database initialization running during build time instead of runtime
3. Missing production database migrations
4. Insufficient error handling for serverless environment failures

**Resolution Time:** ~2 hours  
**Root Cause:** Transaction pooler cannot execute CREATE TABLE commands. Session pooler required.

---

## Issues Encountered

### 1. Database Connection Errors (PRIMARY ISSUE)

**Error Message:**
```
tRPC Error: leaderboard.getTopTen u: Tenant or user not found
PostgreSQL Error Code: XX000 (FATAL)
```

**Root Cause:**
- Used Supabase **Transaction Pooler** URL (port 6543, transaction mode)
- Transaction poolers are optimized for prepared statements but **do NOT support DDL operations**
- CREATE TABLE, CREATE INDEX commands failed with authentication-like errors

**What Went Wrong:**
- The deployment guide and initial configuration recommended Transaction pooler
- Documentation didn't specify that DDL operations require Session pooler
- Error message was misleading ("Tenant or user not found" instead of "DDL not supported")

**Solution:**
- Switch to **Session Pooler** URL (port 6543, session mode)
- Session mode supports all PostgreSQL operations including DDL
- Keep `prepare: false` for compatibility

**Correct Database URL Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```
Use the **Session mode** connection string from Supabase dashboard.

---

### 2. Database Initialization During Build

**Error:**
Database connection attempted during `next build` phase, causing:
- Build failures
- Wasted build minutes
- Confusing error messages during static generation

**Root Cause:**
- Database client initialized at module import time
- No build-time vs runtime detection
- Next.js imports all modules during build for static optimization

**Solution:**
```typescript
// Check if we're in build phase
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.NEXT_BUILD === 'true';

if (!isBuildTime) {
  // Only initialize at runtime
  initializeTables();
}
```

---

### 3. Missing Production Migrations

**Issue:**
- Production database had no tables
- No migration strategy for initial deployment
- Auto-migration attempted during runtime (too late)

**Root Cause:**
- Development workflow relied on local `db:migrate` 
- No pre-deployment migration step
- Assumed tables would exist

**Solution:**
- Created auto-migration that runs on first function invocation
- Added `db:migrate-prod` script for manual migration
- Tables now created with `IF NOT EXISTS` on startup

---

### 4. Insufficient Error Handling

**Issues Found:**
- Redis failures crashed entire requests
- Database errors weren't properly logged
- tRPC errors masked underlying issues

**Fixes Applied:**
- Wrapped all Redis operations in try-catch
- Added detailed error logging with full error objects
- Made Redis optional (graceful degradation)
- Improved database error reporting

---

## Files Modified

### Core Fixes
1. **`src/lib/db/index.ts`**
   - Changed `max: 10` → `max: 1` (serverless optimization)
   - Added `prepare: false` for pooler compatibility
   - Added build-time detection
   - Added auto-migration on startup
   - Added detailed connection logging

2. **`src/lib/redis/index.ts`**
   - Changed `lazyConnect: true` → `lazyConnect: false`
   - Changed `enableReadyCheck: true` → `enableReadyCheck: false`
   - Added retry strategy with max 3 attempts
   - Made Redis failures non-fatal

3. **`src/lib/auth/config.ts`**
   - Wrapped Redis nonce operations in try-catch
   - Added database error logging
   - Made nonce verification optional if Redis fails
   - Added `.catch()` handlers for all DB queries

4. **`src/server/routers/leaderboard.ts`**
   - Added try-catch to all query procedures
   - Added detailed error logging
   - Wrapped Redis cache operations in try-catch
   - Made caching failures non-blocking

5. **`app/api/auth/nonce/route.ts`**
   - Added error handling for Redis failures
   - Made nonce generation continue without Redis

### New Files
1. **`scripts/migrate-production.ts`**
   - Manual migration script for production setup
   - Creates all tables with proper types and indexes
   - Can be run locally against production DB

---

## What Was Wrong With Initial Approach

### ❌ Original Database Recommendations

**Transaction Pooler (WRONG for DDL):**
```
postgresql://...@pooler.supabase.com:6543/postgres
Mode: Transaction
```
- Good for: Read queries, prepared statements, high throughput
- **Cannot do:** CREATE TABLE, ALTER TABLE, CREATE INDEX
- **Error:** Misleading "Tenant or user not found" message

### ✅ Correct Configuration

**Session Pooler (CORRECT for everything):**
```
postgresql://...@pooler.supabase.com:6543/postgres
Mode: Session  
```
- Good for: All operations including DDL
- Supports: CREATE TABLE, indexes, migrations
- Slightly higher latency but more compatible

### Why This Wasn't Caught Earlier

1. **Local development used direct connection** (port 5432)
   - Direct connections support everything
   - Didn't test with pooler locally

2. **Documentation ambiguity**
   - Supabase docs recommend Transaction mode for serverless
   - Doesn't mention DDL limitations clearly
   - Error messages are confusing

3. **No pre-deployment migration strategy**
   - Assumed tables would exist
   - No test deployment to staging

---

## Prevention Strategies for Future

### 1. Pre-Deployment Checklist

**Before deploying to Vercel:**
- [ ] Verify DATABASE_URL uses **Session pooler mode**
- [ ] Run migrations on production database manually first
- [ ] Test database connection with `tsx scripts/migrate-production.ts`
- [ ] Verify all tables exist in production
- [ ] Check all environment variables are set in Vercel
- [ ] Test build locally with production env vars (if safe)

### 2. Database Connection Best Practices

**For Serverless (Vercel, AWS Lambda, etc.):**
```typescript
const client = postgres(DATABASE_URL, {
  prepare: false,        // Required for poolers
  max: 1,               // One connection per function instance
  ssl: 'require',       // Always use SSL for pooler
  idle_timeout: 20,     // Close idle connections
  connect_timeout: 10,  // Fail fast
});
```

**For Development (Local):**
```typescript
const client = postgres(DATABASE_URL, {
  prepare: true,        // Can use prepared statements
  max: 10,             // More connections for dev
  ssl: false,          // No SSL for local
});
```

### 3. Migration Strategy

**Development:**
```bash
npm run db:migrate  # Push schema to local DB
```

**Production (first deploy):**
```bash
# Option 1: Manual script
DATABASE_URL="production-url" npm run db:migrate-prod

# Option 2: Let auto-migration handle it
# (Added in this deployment)
```

**Future migrations:**
- Use drizzle-kit migrations folder
- Run migrations before deploying code changes
- Test migrations on staging first

### 4. Error Handling Requirements

**All database operations must:**
```typescript
try {
  const result = await db.query();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  console.error('Details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
  throw error; // Or handle gracefully
}
```

**All Redis operations must:**
```typescript
if (redis) {
  try {
    await redis.operation();
  } catch (redisError) {
    console.error('Redis error:', redisError);
    // Continue without Redis
  }
}
```

---

## Updated Project Configuration

### Required Vercel Environment Variables

```bash
# Database - MUST use Session Pooler mode
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Auth - MUST be set
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Redis - Optional but recommended
REDIS_URL="rediss://default:[PASS]@[HOST].upstash.io:6379"

# Others
REPLICATE_API_TOKEN="r8_..."
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
```

---

## Lessons Learned

### 1. Supabase Pooler Modes Matter
- **Transaction mode:** Fast, but limited to SELECT/INSERT/UPDATE/DELETE
- **Session mode:** Full PostgreSQL support, use for apps that need DDL
- Don't rely on error messages - "Tenant not found" really meant "DDL not supported"

### 2. Serverless Requires Different Patterns
- Can't assume persistent connections
- Must handle cold starts
- One connection per function instance
- Build-time vs runtime separation critical

### 3. Test With Production-Like Setup
- Local development with direct connection hid pooler issues
- Should have tested with pooler locally first
- Staging environment would have caught this

### 4. Error Messages Can Be Misleading
- PostgreSQL error codes (XX000) are generic
- "Authentication failed" doesn't always mean bad credentials
- Need comprehensive logging to debug serverless issues

### 5. Migration Strategy is Critical
- Can't rely on runtime migrations for first deployment
- Need reproducible migration process
- Auto-migration helps but isn't sufficient alone

---

## Success Metrics

**After fixes applied:**
- ✅ Build completes in ~35 seconds (no database errors)
- ✅ Tables auto-create on first function invocation
- ✅ Leaderboard API returns 200 with empty array
- ✅ Wallet authentication works end-to-end
- ✅ Redis failures don't crash requests
- ✅ All pages load without 500 errors

---

## Action Items for Future Projects

### Project Setup Phase
1. Document which pooler mode is required
2. Add `.env.example` with correct connection string formats
3. Include migration strategy in README
4. Add pre-deployment checklist to DEPLOYMENT_GUIDE.md

### Development Phase
1. Test with pooler locally, not just direct connection
2. Add comprehensive error logging from day 1
3. Make all external services (Redis, etc.) optional with graceful degradation
4. Separate build-time and runtime code explicitly

### Deployment Phase
1. Run migrations before code deploy
2. Verify environment variables are correct
3. Test on Vercel preview deployment first
4. Monitor logs during first 10 minutes after deploy
5. Have rollback plan ready

---

## Conclusion

The primary issue was using Supabase Transaction Pooler for operations requiring Session Pooler. The error message was misleading (authentication error instead of DDL not supported), which extended debugging time.

**Key Takeaway:** For any application that needs to create or modify database schema (DDL operations), always use Supabase **Session Pooler** mode, not Transaction mode.

**All systems are now operational and deployment is successful.**

---

## Quick Reference

**Correct Pooler Setup:**
- Mode: **Session** (not Transaction)
- Port: 6543
- Settings: `prepare: false`, `max: 1`
- Supports: All PostgreSQL operations

**When to use Transaction vs Session:**
- **Transaction:** Read-heavy apps, no schema changes, highest throughput
- **Session:** Apps that create tables, run migrations, need full PostgreSQL
- **When in doubt:** Use Session mode


