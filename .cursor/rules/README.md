# Trogdor Cursor Rules - Complete Guide

This directory contains specialized Cursor AI rules designed to maximize development efficiency for the Trogdor the Burninator project. Each rule is crafted to provide expert-level guidance for specific aspects of the tech stack.

## 📁 Rules Organization

### Always-On Rules (Keep Active)
These rules should ALWAYS be active in your Cursor settings:

1. **expert-developer.mdc**
   - Core development principles
   - Code quality standards
   - Error handling best practices
   - Security guidelines
   - Keep this active at all times for baseline excellence

2. **core-tech-stack.mdc**
   - Next.js 14+ App Router fundamentals
   - TypeScript strict mode patterns
   - tRPC type-safe APIs
   - Drizzle ORM conventions
   - React Server Components
   - Tailwind CSS utilities
   - Keep this active for consistent tech stack usage

### Toggleable Rules (Activate as Needed)
Toggle these on when working on specific features:

#### Database & Caching
- **postgresql-drizzle.mdc** - When working with database schema, queries, or migrations
- **redis-caching.mdc** - When implementing caching, sessions, or rate limiting

#### Authentication & Web3
- **nextauth.mdc** - When building auth flows or session management
- **web3-solana.mdc** - When implementing wallet connection or blockchain interactions

#### External APIs
- **twitter-api.mdc** - When integrating Twitter OAuth or webhooks
- **ai-image-generation.mdc** - When working with Replicate API for image generation

#### Architecture Patterns
- **webhooks-idempotency.mdc** - When building webhook handlers or ensuring exactly-once processing

#### UI & Design
- **design-system.mdc** - When styling components or implementing the hand-drawn aesthetic

## 🚀 How to Use These Rules

### Step 1: Initial Setup
1. Copy all `.mdc` files to your project root directory
2. Open Cursor Settings (Cmd/Ctrl + ,)
3. Navigate to "Cursor Rules" or "AI Rules" section
4. Enable the two ALWAYS-ON rules:
   - `expert-developer.mdc`
   - `core-tech-stack.mdc`

### Step 2: Working on Features
When starting work on a specific feature, enable relevant toggle rules:

**Example: Building Twitter Integration**
```
✅ expert-developer.mdc (always on)
✅ core-tech-stack.mdc (always on)
✅ twitter-api.mdc (enable for this session)
✅ nextauth.mdc (enable for auth linking)
✅ webhooks-idempotency.mdc (enable for webhook handling)
❌ Other toggle rules (keep disabled)
```

**Example: Building AI Image Generator**
```
✅ expert-developer.mdc (always on)
✅ core-tech-stack.mdc (always on)
✅ ai-image-generation.mdc (enable)
✅ redis-caching.mdc (enable for rate limiting)
✅ postgresql-drizzle.mdc (enable for storing generations)
❌ Other toggle rules (keep disabled)
```

**Example: Styling Components**
```
✅ expert-developer.mdc (always on)
✅ core-tech-stack.mdc (always on)
✅ design-system.mdc (enable)
❌ Other toggle rules (keep disabled)
```

### Step 3: Efficient AI Prompting
With rules active, your prompts can be more concise. The AI already knows the context.

**❌ Without Rules (Bad):**
```
"Create a React Server Component that fetches users from PostgreSQL using 
Drizzle ORM, implements proper error handling, uses TypeScript strict mode, 
follows Next.js 14 App Router conventions, and styles it with Tailwind CSS 
using our hand-drawn Excalidraw aesthetic with notebook paper background..."
```

**✅ With Rules (Good):**
```
"Create a leaderboard component that shows top 10 users"
```

The AI will automatically:
- Use React Server Component pattern
- Fetch data with Drizzle ORM
- Apply proper TypeScript types
- Style with hand-drawn aesthetic
- Implement error handling
- Follow all best practices

## 🎯 Rule Activation Strategy by Feature

### Feature: Web3 Wallet Authentication
**Active Rules:**
- ✅ expert-developer
- ✅ core-tech-stack
- ✅ web3-solana
- ✅ nextauth
- ✅ redis-caching (for nonces)

**Prompt Examples:**
- "Create wallet connect button with signature verification"
- "Build the nonce generation endpoint"
- "Implement the auth callback for wallet verification"

---

### Feature: Twitter Mention Monitoring
**Active Rules:**
- ✅ expert-developer
- ✅ core-tech-stack
- ✅ twitter-api
- ✅ webhooks-idempotency
- ✅ postgresql-drizzle
- ✅ redis-caching

**Prompt Examples:**
- "Create the Twitter webhook endpoint with signature verification"
- "Build the tweet quality scoring algorithm"
- "Implement idempotent tweet processing"

---

### Feature: Leaderboard System
**Active Rules:**
- ✅ expert-developer
- ✅ core-tech-stack
- ✅ postgresql-drizzle
- ✅ redis-caching
- ✅ design-system

**Prompt Examples:**
- "Create leaderboard component with Redis caching"
- "Build the daily leaderboard snapshot cron job"
- "Style the leaderboard table with hand-drawn aesthetic"

---

### Feature: AI Image Generation
**Active Rules:**
- ✅ expert-developer
- ✅ core-tech-stack
- ✅ ai-image-generation
- ✅ redis-caching (for rate limiting)
- ✅ postgresql-drizzle (for generation history)
- ✅ design-system (for UI)

**Prompt Examples:**
- "Create image generation form with prompt enhancement"
- "Build the Replicate webhook handler"
- "Implement rate limiting for image generation"

---

### Feature: UI Components & Pages
**Active Rules:**
- ✅ expert-developer
- ✅ core-tech-stack
- ✅ design-system

**Prompt Examples:**
- "Create the homepage hero section"
- "Build a card component with sketch borders"
- "Style the navigation with flame animations"

## 💡 Pro Tips

### 1. Context Switching
When switching between features, update your active rules:
```
Working on Twitter → Working on UI
- Disable: twitter-api, webhooks-idempotency
- Enable: design-system
```

### 2. Multiple Rules for Complex Features
For complex features, activate multiple toggle rules:
```
Building user profile page:
- postgresql-drizzle (fetch user data)
- redis-caching (cache profile)
- design-system (style page)
- nextauth (require authentication)
```

### 3. Rule Combinations
Some features naturally need specific rule combinations:

**Database-heavy features:**
- postgresql-drizzle + redis-caching

**External API features:**
- twitter-api + webhooks-idempotency + redis-caching

**Frontend features:**
- design-system (+ any relevant backend rules)

### 4. Minimal Rule Loading
Don't activate all rules at once. Too many rules can:
- Slow down AI responses
- Create conflicting guidance
- Reduce context window for your actual code

Keep only 3-5 rules active at a time (including the 2 always-on rules).

### 5. Rule Priority
When rules conflict, follow this priority:
1. expert-developer (highest priority)
2. core-tech-stack
3. Feature-specific toggle rules
4. Design system (style decisions)

## 📊 Quick Reference Chart

| Working On | Enable These Rules |
|------------|-------------------|
| Initial Setup | ALWAYS-ON + CORE |
| Auth System | ALWAYS-ON + CORE + nextauth + web3-solana + redis |
| Twitter Integration | ALWAYS-ON + CORE + twitter + webhooks + redis + postgresql |
| Image Generation | ALWAYS-ON + CORE + ai-image + redis + postgresql |
| Leaderboard | ALWAYS-ON + CORE + postgresql + redis + design-system |
| UI Components | ALWAYS-ON + CORE + design-system |
| Database Schema | ALWAYS-ON + CORE + postgresql |
| Caching Logic | ALWAYS-ON + CORE + redis |
| API Routes | ALWAYS-ON + CORE + (relevant feature rule) |

## 🔧 Rule Maintenance

### When to Update Rules
- Adding new dependencies to the project
- Discovering better patterns through development
- Team decides on new conventions
- External APIs update their documentation

### How to Update
1. Edit the relevant `.mdc` file
2. Save changes
3. Cursor automatically reloads the rule
4. Test with a prompt to verify changes

### Rule File Naming Convention
```
{name}.mdc    # Always active rules
{name}.mdc         # Core framework rules
{name}.mdc           # Feature-specific rules
```

## 🎓 Learning Path

### Week 1: Getting Started
- **Day 1-2:** Use only ALWAYS-ON + CORE rules
- **Day 3-4:** Add design-system rule, build UI components
- **Day 5-7:** Add postgresql-drizzle, build database schema

### Week 2: Backend Features
- **Day 1-3:** Add nextauth + web3-solana, build authentication
- **Day 4-5:** Add redis-caching, implement caching layer
- **Day 6-7:** Add twitter-api + webhooks, build Twitter integration

### Week 3: Advanced Features
- **Day 1-3:** Add ai-image-generation, build image generator
- **Day 4-5:** Combine all rules for leaderboard system
- **Day 6-7:** Polish and optimize with all relevant rules

## 📝 Notes

### Rule Size Limits
- Each rule is under 2000 characters (Cursor's recommended limit)
- Focused on specific concerns for maximum effectiveness
- Concise but comprehensive

### Best Practices from Rules
These rules encode:
- ✅ Type safety with TypeScript strict mode
- ✅ Server Components by default pattern
- ✅ Proper error handling everywhere
- ✅ Security-first approach (signature verification, rate limiting)
- ✅ Performance optimization (caching, indexes)
- ✅ Idempotency for critical operations
- ✅ Consistent code style and naming

### Rule Philosophy
Each rule follows the principle:
> "Give the AI expert-level knowledge so you can focus on what to build, not how to build it."

## 🔥 Ready to Build!

You now have a complete set of Cursor rules that will guide you through building the entire Trogdor project with expert-level code quality.

**Start simple:**
1. Enable ALWAYS-ON + CORE rules
2. Create your first component
3. Add toggle rules as you progress

**Remember:** These rules make Cursor your expert pair programmer. Use them wisely, and may your burnination be ever complete! 🔥🐉

---

*Questions? Reference the specific rule file for detailed patterns and examples.*
*Issues? Check that you have the correct rules active for your current task.*
