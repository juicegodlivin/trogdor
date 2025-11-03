# Twitter Integration Implementation Plan

## Overview
Integrate twitterapi.io to track mentions of @trogdorcult and award points to users based on tweet quality.

---

## Phase 1: Twitter API Client (twitterapi.io)

### What is twitterapi.io?
- **NOT** the official Twitter/X API
- Third-party service that provides Twitter API access without direct Twitter API credentials
- Simpler authentication (just an API key)
- Good for: searching tweets, getting user info, basic operations
- **Limitation:** May not support webhooks (need to verify)

### Files to Create:
1. `src/lib/api/twitter.ts` - Main Twitter client
2. `src/lib/api/twitter-types.ts` - TypeScript types
3. `scripts/fetch-mentions.ts` - Manual mention fetching script

### Environment Variables Needed:
```bash
TWITTERAPI_IO_API_KEY="your-key-here"  # You said you added this
TWITTER_ACCOUNT_USERNAME="trogdorcult"   # The account to monitor
TWITTER_WEBHOOK_SECRET="random-secret"   # For webhook verification (if supported)
```

---

## Phase 2: Mention Fetching Strategies

### Option A: Webhook-based (Preferred if supported)
- twitterapi.io sends real-time mentions to our endpoint
- Already have webhook handler at `app/api/webhooks/twitter/route.ts`
- **Need to verify:** Does twitterapi.io support webhooks?

### Option B: Polling-based (Fallback)
- Cron job fetches mentions every 5-15 minutes
- Use Vercel Cron Jobs
- Search for tweets mentioning @trogdorcult
- Store last fetched tweet ID to avoid duplicates

### Recommended: Start with Option B (Polling)
- More reliable
- Easier to set up
- Can switch to webhooks later

---

## Phase 3: Twitter Account Linking

### Current Issue:
Users need to link their Twitter account to their wallet address so we can award points.

### Solution: Twitter OAuth Flow
1. User clicks "Link Twitter" on profile page
2. OAuth redirect to Twitter
3. Twitter returns with user's Twitter ID
4. Store `twitterId`, `twitterHandle` in user record
5. Now when they mention @trogdorcult, we can match them

### Alternative (No OAuth):
- User manually enters their Twitter handle
- We verify ownership by having them tweet a verification code
- Simpler but less secure

---

## Phase 4: Mention Processing Flow

```
1. Fetch mentions → twitterapi.io search endpoint
2. For each tweet:
   a. Check if already processed (idempotency)
   b. Extract author Twitter ID
   c. Find user in DB by twitterId
   d. If no user found → skip (they haven't linked account)
   e. Calculate quality score
   f. Award points → insert into twitter_mentions table
   g. Update user.totalOfferings
   h. Invalidate leaderboard cache
```

---

## Phase 5: Leaderboard Integration

### Already Built:
- `users.totalOfferings` field exists
- Leaderboard router already queries this
- Just need to update totalOfferings when mentions are processed

### Update Logic:
```typescript
// When processing mention:
await db.update(users)
  .set({
    totalOfferings: sql`${users.totalOfferings} + ${pointsAwarded}`,
  })
  .where(eq(users.id, user.id));
```

---

## Implementation Steps (In Order)

### Step 1: Create Twitter API Client ✅ NEXT
- Create `src/lib/api/twitter.ts`
- Implement search mentions
- Implement get tweet details
- Test with your API key

### Step 2: Create Mention Fetching Script
- Create `scripts/fetch-mentions.ts`
- Fetch mentions from last 24 hours
- Process and score each mention
- Test locally

### Step 3: Add Cron Job
- Create `app/api/cron/fetch-mentions/route.ts`
- Configure `vercel.json` for cron schedule
- Run every 15 minutes

### Step 4: Twitter Account Linking (Simple Version)
- Add "Link Twitter" button to profile
- User enters their Twitter handle
- We search their recent tweets for verification code
- Link if found

### Step 5: Twitter Account Linking (OAuth Version) - LATER
- Implement full OAuth flow
- More secure but more complex
- Can do after MVP working

### Step 6: Update Leaderboard to Show Twitter Data
- Show recent mentions
- Show top tweets
- Display user's Twitter handle

---

## Testing Strategy

### Local Testing:
1. Use your twitterapi.io key
2. Search for real mentions of @trogdorcult
3. Process them and verify scoring works
4. Check database records are created

### Production Testing:
1. Deploy to Vercel
2. Test cron job manually via Vercel API
3. Link your Twitter account
4. Tweet mentioning @trogdorcult
5. Wait for cron to run
6. Verify points awarded

---

## Files Needing Updates

### New Files:
- `src/lib/api/twitter.ts` - Twitter client
- `src/lib/api/twitter-types.ts` - Types
- `scripts/fetch-mentions.ts` - Manual script
- `app/api/cron/fetch-mentions/route.ts` - Cron endpoint
- `src/components/profile/TwitterLinkCard.tsx` - UI for linking

### Existing Files to Update:
- `vercel.json` - Add cron schedule
- `src/lib/db/index.ts` - Add twitter_mentions table migration
- `src/server/routers/user.ts` - Add Twitter linking mutations
- `app/(main)/profile/page.tsx` - Add Twitter link UI

---

## Migration Needed

The `twitter_mentions` table needs to be created in production:

```sql
CREATE TABLE IF NOT EXISTS twitter_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  tweet_id TEXT NOT NULL UNIQUE,
  tweet_url TEXT NOT NULL,
  content TEXT NOT NULL,
  has_image BOOLEAN DEFAULT FALSE,
  has_video BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  retweets INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  quality_score INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  processed_at TIMESTAMP DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT TRUE,
  metadata JSONB
);

CREATE INDEX user_id_mentions_idx ON twitter_mentions(user_id);
CREATE UNIQUE INDEX tweet_id_idx ON twitter_mentions(tweet_id);
CREATE INDEX created_at_mentions_idx ON twitter_mentions(created_at);
CREATE INDEX points_idx ON twitter_mentions(points_awarded);
```

---

## Questions to Answer

1. **Does twitterapi.io support webhooks?**
   - If yes → use webhook approach
   - If no → use polling (cron job)

2. **What's your preference for account linking?**
   - Simple: Manual handle entry + verification tweet
   - Advanced: Full OAuth flow

3. **How often should we fetch mentions?**
   - Every 5 minutes (aggressive, more API calls)
   - Every 15 minutes (balanced)
   - Every hour (conservative)

---

## Let's Start!

I recommend starting with:
1. **Create Twitter API client** (using your twitterapi.io key)
2. **Test fetching mentions manually**
3. **Process one mention end-to-end**
4. **Then** set up automation

This way we can verify everything works before automating.

Ready to begin? Let me know and I'll create the Twitter client first.

