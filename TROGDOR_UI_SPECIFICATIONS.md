# TROGDOR UI/UX SPECIFICATIONS

## COMPONENT MAPPING FROM EXCALIDRAW WIREFRAMES

Based on your Excalidraw mockups, here's the detailed breakdown of each page with component specifications and implementation guidance.

---

## PAGE 1: LANDING PAGE

### Layout Structure
```
┌──────────────────────────────────────┐
│  HEADER (Navigation)                 │
├──────────────────────────────────────┤
│  ┌────┐                              │
│  │Logo│  Trogdor the Burninator      │
│  └────┘                              │
│                                      │
│  Core Burnination Tenants            │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │Tenant 1│ │Tenant 2│ │Tenant 3│  │
│  └────────┘ └────────┘ └────────┘  │
│                                      │
│  [Connect Wallet Button]             │
└──────────────────────────────────────┘
```

### Components

#### 1. Hero Section
```tsx
// components/landing/HeroSection.tsx
- Trogdor logo/illustration (hand-drawn, animated on hover)
- Main headline: "Trogdor the Burninator" (flame-text effect)
- Subheadline: "Join the Cult. Burninate Together."
- CTA Button: "Sign the Ledger" (Web3 wallet connect)
```

**Design Specs:**
- Logo: 200x200px, crude pencil sketch style
- Headline: 48px, font-hand (Caveat), flame gradient
- Button: btn-sketch class, green accent on hover
- Background: subtle notebook-paper effect

#### 2. Core Tenants Section
Three card layout with hand-drawn borders:

**Card 1: "Burnination is Life"**
- Icon: Flame sketch
- Description: "Every mention is an offering to Trogdor"
- Points value display

**Card 2: "Quality Over Quantity"**
- Icon: Trophy sketch
- Description: "High-quality posts earn more offerings"
- Scoring breakdown link

**Card 3: "The Cult Rewards"**
- Icon: Token/coin sketch
- Description: "Top contributors receive token payouts"
- Leaderboard preview stats

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {tenants.map(tenant => (
    <div className="border-sketch p-6 bg-sketch-light hover:shadow-sketch-lg">
      <HandDrawnIcon icon={tenant.icon} />
      <h3 className="font-hand text-2xl">{tenant.title}</h3>
      <p className="text-pencil">{tenant.description}</p>
    </div>
  ))}
</div>
```

#### 3. Leaderboard Preview
Mini version showing top 5:
```tsx
// components/landing/LeaderboardPreview.tsx
- Table with rank, username, offerings count
- "View Full Leaderboard" CTA
- Live update badge (pulsing green dot)
```

#### 4. Call-to-Action Footer
```tsx
- "Join [X] Cult Members" (dynamic count)
- Wallet connect button (primary)
- "Learn the Lore" button (secondary)
```

---

## PAGE 2: HISTORY & LORE INDEX

### Layout Structure
```
┌──────────────────────────────────────┐
│  The Legacy of Trogdor the Burninator│
│                                      │
│  ┌─────────────────────────────┐   │
│  │  Content Block 1            │   │
│  │  [Image] [Text]             │   │
│  └─────────────────────────────┘   │
│                                      │
│  ┌─────────────────────────────┐   │
│  │  Content Block 2            │   │
│  │  [Text] [Image]             │   │
│  └─────────────────────────────┘   │
│                                      │
│  ┌─────────────────────────────┐   │
│  │  Content Block 3            │   │
│  │  [Image] [Text]             │   │
│  └─────────────────────────────┘   │
└──────────────────────────────────────┘
```

### Components

#### 1. Timeline Navigation (Sidebar)
```tsx
// components/history/TimelineNav.tsx
<div className="sticky top-20">
  <h3 className="font-hand text-xl">The Chronicles</h3>
  <ul className="space-y-2">
    <li><a href="#origin">The Origin (2003)</a></li>
    <li><a href="#flash-game">TROGDOR! Arcade</a></li>
    <li><a href="#guitar-hero">Guitar Hero Era</a></li>
    <li><a href="#board-game">$1.4M Kickstarter</a></li>
    <li><a href="#today">Today & Beyond</a></li>
  </ul>
</div>
```

#### 2. Story Content Blocks
Alternating image-left / image-right layout:

```tsx
// components/history/StoryBlock.tsx
interface StoryBlockProps {
  id: string;
  year: string;
  title: string;
  content: string;
  image: string;
  imagePosition: 'left' | 'right';
  highlights?: string[];
}

<section id={id} className="py-12 scroll-mt-20">
  <div className={`flex flex-col ${imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}>
    <div className="md:w-1/2">
      <div className="notebook-paper p-6 border-sketch">
        <img src={image} alt={title} className="w-full" />
      </div>
    </div>
    <div className="md:w-1/2">
      <div className="border-2 border-dashed border-pencil p-6">
        <span className="text-sm text-pencil-light">{year}</span>
        <h2 className="font-hand text-4xl mb-4">{title}</h2>
        <p className="text-lg leading-relaxed">{content}</p>
        {highlights && (
          <ul className="mt-4 space-y-2">
            {highlights.map(h => (
              <li className="flex items-start">
                <span className="text-accent-red mr-2">→</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
</section>
```

#### 3. Interactive Elements

**Quote Callouts** (hand-drawn speech bubbles):
```tsx
<div className="relative my-8 p-6 bg-yellow-50 border-sketch">
  <div className="absolute -top-3 -left-3 w-8 h-8">
    <HandDrawnQuoteMark />
  </div>
  <p className="font-hand text-2xl italic">
    "TROGDOR was a man! Or maybe he was a dragon-man!"
  </p>
  <span className="text-sm text-pencil-light">
    — Strong Bad Email #58, January 13, 2003
  </span>
</div>
```

**Burnination Counter** (animated):
```tsx
// Shows total mentions/offerings across history
<div className="text-center py-12 bg-gradient-to-r from-accent-red/10 to-accent-yellow/10">
  <h3 className="font-hand text-3xl mb-4">Total Burninations to Date</h3>
  <div className="text-6xl font-bold flame-text">
    <CountUp end={totalMentions} duration={2} />
  </div>
  <p className="text-pencil mt-2">Peasants burninated and counting...</p>
</div>
```

---

## PAGE 3: PRODUCTS SHOWCASE

### Layout Structure
```
┌──────────────────────────────────────┐
│  Trogdor Products                    │
│                                      │
│  The Official Trogdor Collection     │
│                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │Product │  │Product │  │Product ││
│  │Image 1 │  │Image 2 │  │Image 3 ││
│  │        │  │        │  │        ││
│  │[Info]  │  │[Info]  │  │[Info]  ││
│  └────────┘  └────────┘  └────────┘│
└──────────────────────────────────────┘
```

### Components

#### 1. Product Grid
```tsx
// components/products/ProductGrid.tsx
interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'official' | 'community' | 'tool';
  link?: string;
  year: string;
  price?: string;
}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</div>
```

#### 2. Product Card Component
```tsx
// components/products/ProductCard.tsx
<div className="border-sketch bg-white hover:shadow-sketch-lg transition-all group">
  {/* Image Container */}
  <div className="notebook-paper p-4 aspect-square flex items-center justify-center">
    <img 
      src={product.image} 
      alt={product.name}
      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
    />
  </div>
  
  {/* Info Section */}
  <div className="p-6">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs uppercase tracking-wide text-pencil-light">
        {product.category}
      </span>
      <span className="text-xs text-pencil-light">{product.year}</span>
    </div>
    
    <h3 className="font-hand text-2xl mb-2">{product.name}</h3>
    <p className="text-pencil text-sm mb-4">{product.description}</p>
    
    {product.price && (
      <div className="text-lg font-bold text-accent-green mb-3">
        {product.price}
      </div>
    )}
    
    {product.link && (
      <a 
        href={product.link}
        target="_blank"
        className="btn-sketch w-full text-center block"
      >
        View Product →
      </a>
    )}
  </div>
</div>
```

#### 3. Featured Products Section

**Guitar Hero II** (special spotlight):
```tsx
<div className="col-span-full bg-gradient-to-r from-accent-red/20 to-accent-yellow/20 p-8 border-sketch">
  <div className="flex flex-col md:flex-row gap-8 items-center">
    <div className="md:w-1/2">
      <img src="/images/guitar-hero.jpg" alt="Guitar Hero II" />
    </div>
    <div className="md:w-1/2">
      <span className="text-xs uppercase text-accent-red">Legendary</span>
      <h2 className="font-hand text-5xl mb-4">Guitar Hero II</h2>
      <p className="text-lg mb-4">
        The song that introduced millions to Trogdor. 
        Featured as an unlockable bonus track in 2006.
      </p>
      <div className="flex gap-4">
        <a href="#history" className="btn-sketch">
          Read the Story
        </a>
        <a href="https://youtube.com/watch?v=..." className="btn-sketch">
          Watch Video
        </a>
      </div>
    </div>
  </div>
</div>
```

#### 4. Category Filters
```tsx
// Sticky filter bar
<div className="sticky top-20 z-10 bg-white/90 backdrop-blur-sm py-4 border-y-2 border-sketch mb-8">
  <div className="flex gap-4 justify-center">
    {categories.map(cat => (
      <button
        onClick={() => setFilter(cat.value)}
        className={`px-4 py-2 font-hand text-lg ${
          filter === cat.value 
            ? 'border-sketch bg-accent-green text-white' 
            : 'border-sketch hover:bg-sketch'
        }`}
      >
        {cat.label}
      </button>
    ))}
  </div>
</div>
```

---

## PAGE 4: TROGDOR OFFERINGS LEADERBOARD

### Layout Structure
```
┌──────────────────────────────────────┐
│  Leaderboard Rules                   │
│  [Points System Explained]           │
│                                      │
│  ┌──────────────────────────────┐  │
│  │ Rank │ User │ Score │ Badges │  │
│  ├──────────────────────────────┤  │
│  │  1   │ ...  │ ...   │  ...   │  │
│  │  2   │ ...  │ ...   │  ...   │  │
│  │  3   │ ...  │ ...   │  ...   │  │
│  └──────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Components

#### 1. Leaderboard Rules Section
```tsx
// components/leaderboard/RulesSection.tsx
<div className="mb-8 border-sketch bg-sketch-light p-6">
  <h2 className="font-hand text-3xl mb-4">How Offerings Work</h2>
  
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h3 className="font-hand text-xl mb-2">Point System</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start">
          <span className="text-accent-green font-bold mr-2">1-100</span>
          <span>Points per mention based on engagement quality</span>
        </li>
        <li className="flex items-start">
          <span className="text-accent-green font-bold mr-2">+10</span>
          <span>Bonus for including images</span>
        </li>
        <li className="flex items-start">
          <span className="text-accent-green font-bold mr-2">+20</span>
          <span>Bonus for viral posts (>10k impressions)</span>
        </li>
      </ul>
    </div>
    
    <div>
      <h3 className="font-hand text-xl mb-2">Quality Factors</h3>
      <ul className="space-y-2 text-sm">
        <li>✓ Likes & retweets</li>
        <li>✓ Original content</li>
        <li>✓ Trogdor imagery</li>
        <li>✓ Community engagement</li>
        <li>✗ Spam or low-effort posts</li>
      </ul>
    </div>
  </div>
  
  <div className="mt-6 p-4 bg-accent-yellow/20 border-2 border-dashed border-accent-yellow">
    <p className="font-hand text-lg">
      🔥 Weekly Rewards: Top 10 contributors receive token payouts!
    </p>
  </div>
</div>
```

#### 2. Period Selector
```tsx
// components/leaderboard/PeriodSelector.tsx
<div className="flex justify-center gap-2 mb-6">
  {['All Time', 'Monthly', 'Weekly', 'Daily'].map(period => (
    <button
      onClick={() => setPeriod(period)}
      className={`px-6 py-2 font-hand text-lg ${
        selectedPeriod === period
          ? 'border-sketch bg-accent-green text-white'
          : 'border-sketch hover:bg-sketch'
      }`}
    >
      {period}
    </button>
  ))}
</div>
```

#### 3. Leaderboard Table
```tsx
// components/leaderboard/LeaderboardTable.tsx
<div className="border-sketch bg-white overflow-hidden">
  <table className="w-full">
    <thead className="bg-sketch border-b-2 border-pencil">
      <tr>
        <th className="p-4 text-left font-hand text-xl">Rank</th>
        <th className="p-4 text-left font-hand text-xl">Cultist</th>
        <th className="p-4 text-right font-hand text-xl">Offerings</th>
        <th className="p-4 text-right font-hand text-xl">Quality</th>
        <th className="p-4 text-center font-hand text-xl">Badges</th>
      </tr>
    </thead>
    <tbody>
      {leaderboard.map((entry, idx) => (
        <LeaderboardRow 
          key={entry.userId} 
          entry={entry} 
          rank={idx + 1}
          isCurrentUser={entry.userId === currentUser?.id}
        />
      ))}
    </tbody>
  </table>
</div>
```

#### 4. Leaderboard Row Component
```tsx
// components/leaderboard/LeaderboardRow.tsx
<tr className={`border-b border-sketch hover:bg-sketch-light transition-colors ${
  isCurrentUser ? 'bg-accent-green/10 font-bold' : ''
} ${rank <= 3 ? 'bg-accent-yellow/10' : ''}`}>
  
  {/* Rank */}
  <td className="p-4">
    <div className="flex items-center gap-2">
      {rank <= 3 && (
        <span className="text-2xl">
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
        </span>
      )}
      <span className="text-lg font-bold">#{rank}</span>
    </div>
  </td>
  
  {/* User */}
  <td className="p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 border-sketch rounded-full overflow-hidden">
        <img 
          src={entry.profileImage || '/default-avatar.png'} 
          alt={entry.username}
        />
      </div>
      <div>
        <div className="font-hand text-lg">
          {entry.username || truncateAddress(entry.walletAddress)}
        </div>
        {entry.twitterHandle && (
          <a 
            href={`https://twitter.com/${entry.twitterHandle}`}
            target="_blank"
            className="text-sm text-accent-blue hover:underline"
          >
            @{entry.twitterHandle}
          </a>
        )}
      </div>
    </div>
  </td>
  
  {/* Offerings Count */}
  <td className="p-4 text-right">
    <div className="text-2xl font-bold text-accent-green">
      {entry.totalOfferings.toLocaleString()}
    </div>
    <div className="text-sm text-pencil-light">
      {entry.totalMentions} posts
    </div>
  </td>
  
  {/* Quality Score */}
  <td className="p-4 text-right">
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sketch rounded-full">
      <div className={`w-2 h-2 rounded-full ${
        entry.averageQuality >= 80 ? 'bg-accent-green' :
        entry.averageQuality >= 50 ? 'bg-accent-yellow' :
        'bg-accent-red'
      }`} />
      <span className="font-mono">{entry.averageQuality}/100</span>
    </div>
  </td>
  
  {/* Badges */}
  <td className="p-4 text-center">
    <div className="flex justify-center gap-1">
      {entry.badges?.map(badge => (
        <div 
          key={badge}
          className="w-8 h-8 border-sketch bg-accent-yellow/20 rounded-full flex items-center justify-center"
          title={badge}
        >
          {getBadgeIcon(badge)}
        </div>
      ))}
    </div>
  </td>
</tr>
```

#### 5. Search & Filter Bar
```tsx
// components/leaderboard/SearchBar.tsx
<div className="mb-6 flex gap-4">
  <div className="flex-1">
    <input
      type="text"
      placeholder="Search by username or wallet address..."
      className="w-full px-4 py-3 border-sketch font-hand text-lg"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  <button className="btn-sketch px-6">
    🔍 Search
  </button>
</div>
```

#### 6. User Highlight Card
If user is logged in, show their position:
```tsx
<div className="mb-6 border-sketch bg-gradient-to-r from-accent-green/20 to-accent-blue/20 p-6">
  <div className="flex justify-between items-center">
    <div>
      <span className="text-sm text-pencil-light">Your Rank</span>
      <div className="text-4xl font-bold">#{currentUser.rank}</div>
    </div>
    <div>
      <span className="text-sm text-pencil-light">Your Offerings</span>
      <div className="text-4xl font-bold text-accent-green">
        {currentUser.totalOfferings}
      </div>
    </div>
    <div>
      <a href={`/profile/${currentUser.address}`} className="btn-sketch">
        View Profile
      </a>
    </div>
  </div>
</div>
```

---

## PAGE 5: LEADERBOARD PAGE (EXPANDED)

This is essentially the same as Page 4 but with additional features:

### Additional Components

#### 1. Pagination
```tsx
<div className="flex justify-center items-center gap-4 mt-8">
  <button 
    disabled={page === 1}
    className="btn-sketch disabled:opacity-50"
  >
    ← Previous
  </button>
  <span className="font-hand text-lg">
    Page {page} of {totalPages}
  </span>
  <button 
    disabled={page === totalPages}
    className="btn-sketch disabled:opacity-50"
  >
    Next →
  </button>
</div>
```

#### 2. Stats Dashboard
```tsx
// components/leaderboard/StatsPanel.tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <StatCard
    icon="👥"
    label="Total Cultists"
    value={stats.totalUsers.toLocaleString()}
  />
  <StatCard
    icon="🔥"
    label="Total Offerings"
    value={stats.totalOfferings.toLocaleString()}
  />
  <StatCard
    icon="📱"
    label="Posts This Week"
    value={stats.weeklyPosts.toLocaleString()}
  />
  <StatCard
    icon="💰"
    label="Tokens Distributed"
    value={`${stats.tokensDistributed.toLocaleString()} $TROG`}
  />
</div>
```

#### 3. Live Activity Feed
```tsx
// Sidebar component showing recent mentions
<div className="border-sketch bg-white p-6">
  <h3 className="font-hand text-2xl mb-4">Recent Offerings 🔥</h3>
  <div className="space-y-4">
    {recentMentions.map(mention => (
      <div key={mention.id} className="text-sm border-b border-sketch pb-3">
        <div className="flex items-center gap-2 mb-1">
          <img 
            src={mention.user.avatar} 
            className="w-6 h-6 rounded-full"
          />
          <span className="font-bold">@{mention.user.handle}</span>
          <span className="text-pencil-light">
            {timeAgo(mention.createdAt)}
          </span>
        </div>
        <p className="text-pencil line-clamp-2">{mention.content}</p>
        <div className="flex gap-3 mt-2 text-xs text-pencil-light">
          <span>❤️ {mention.likes}</span>
          <span>🔁 {mention.retweets}</span>
          <span className="text-accent-green font-bold">
            +{mention.points} pts
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## PAGE 6: IMAGE GENERATOR

### Layout Structure
```
┌──────────────────────────────────────┐
│  Generate Your Trogdor Memes         │
│                                      │
│  ┌──────────────────────────────┐  │
│  │  Prompt Input                 │  │
│  │  [Text Area]                  │  │
│  │                               │  │
│  │  [Generate Button]            │  │
│  └──────────────────────────────┘  │
│                                      │
│  ┌──────────────────────────────┐  │
│  │  Generated Image Display      │  │
│  │  [Image Preview]              │  │
│  │  [Download] [Share] [Tweet]   │  │
│  └──────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Components

#### 1. Generator Form
```tsx
// components/generator/GeneratorForm.tsx
<div className="border-sketch bg-white p-8">
  <h2 className="font-hand text-3xl mb-6">
    Describe Your Burnination Scene
  </h2>
  
  <form onSubmit={handleGenerate}>
    {/* Prompt Input */}
    <div className="mb-6">
      <label className="block font-hand text-xl mb-2">
        What should Trogdor burninate?
      </label>
      <textarea
        className="w-full p-4 border-sketch font-sans text-lg notebook-paper"
        rows={4}
        placeholder="e.g., 'Trogdor burninating a Bitcoin conference' or 'Trogdor destroying a modern tech startup office'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={500}
      />
      <div className="text-sm text-pencil-light mt-1">
        {prompt.length}/500 characters
      </div>
    </div>
    
    {/* Style Presets */}
    <div className="mb-6">
      <label className="block font-hand text-xl mb-2">
        Style Preset
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {presets.map(preset => (
          <button
            type="button"
            onClick={() => setStyle(preset.value)}
            className={`p-3 border-sketch text-sm ${
              style === preset.value ? 'bg-accent-green text-white' : ''
            }`}
          >
            {preset.icon} {preset.label}
          </button>
        ))}
      </div>
    </div>
    
    {/* Generate Button */}
    <button
      type="submit"
      disabled={isGenerating || !prompt.trim()}
      className="w-full btn-sketch py-4 text-xl disabled:opacity-50"
    >
      {isGenerating ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner /> Burninating...
        </span>
      ) : (
        '🔥 Generate Trogdor Meme'
      )}
    </button>
    
    {/* Cost Display */}
    <div className="mt-4 text-center text-sm text-pencil-light">
      Free for cult members • Rate limit: 5 per hour
    </div>
  </form>
</div>
```

#### 2. Generation Queue Status
```tsx
// Shows position in queue if busy
{queuePosition > 0 && (
  <div className="mt-4 p-4 border-sketch bg-sketch-light">
    <div className="flex items-center justify-between">
      <span className="font-hand text-lg">Queue Position</span>
      <span className="text-2xl font-bold text-accent-green">
        #{queuePosition}
      </span>
    </div>
    <div className="mt-2 bg-sketch rounded-full h-2 overflow-hidden">
      <div 
        className="bg-accent-green h-full transition-all duration-500"
        style={{ width: `${(1 - queuePosition / 10) * 100}%` }}
      />
    </div>
  </div>
)}
```

#### 3. Generated Image Display
```tsx
// components/generator/GeneratedImage.tsx
<div className="border-sketch bg-white p-8">
  {/* Image Container */}
  <div className="notebook-paper p-6 mb-6">
    <img
      src={generatedImage.url}
      alt={generatedImage.prompt}
      className="w-full border-sketch"
    />
  </div>
  
  {/* Prompt Display */}
  <div className="mb-6 p-4 bg-sketch-light border-2 border-dashed border-pencil">
    <span className="text-xs uppercase text-pencil-light">Prompt</span>
    <p className="font-hand text-lg">{generatedImage.prompt}</p>
  </div>
  
  {/* Action Buttons */}
  <div className="grid grid-cols-3 gap-4">
    <button
      onClick={handleDownload}
      className="btn-sketch"
    >
      📥 Download
    </button>
    <button
      onClick={handleShare}
      className="btn-sketch"
    >
      🔗 Share
    </button>
    <button
      onClick={handleTweetImage}
      className="btn-sketch bg-accent-blue text-white"
    >
      🐦 Tweet
    </button>
  </div>
  
  {/* Stats */}
  <div className="mt-6 flex justify-around text-center text-sm">
    <div>
      <div className="text-2xl font-bold">{generatedImage.downloads}</div>
      <div className="text-pencil-light">Downloads</div>
    </div>
    <div>
      <div className="text-2xl font-bold text-accent-red">
        {generatedImage.likes}
      </div>
      <div className="text-pencil-light">Likes</div>
    </div>
    <div>
      <div className="text-2xl font-bold text-accent-green">
        {generatedImage.shares}
      </div>
      <div className="text-pencil-light">Shares</div>
    </div>
  </div>
</div>
```

#### 4. Gallery of Recent Generations
```tsx
// components/generator/RecentGallery.tsx
<div className="mt-12">
  <h3 className="font-hand text-3xl mb-6">Recent Burninations</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {recentImages.map(img => (
      <div 
        key={img.id}
        className="border-sketch hover:shadow-sketch-lg cursor-pointer group"
        onClick={() => setSelectedImage(img)}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={img.url}
            alt={img.prompt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        </div>
        <div className="p-2 bg-white">
          <p className="text-xs text-pencil-light line-clamp-1">
            {img.prompt}
          </p>
          <div className="flex justify-between text-xs mt-1">
            <span>❤️ {img.likes}</span>
            <span>📥 {img.downloads}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

#### 5. Example Prompts
```tsx
// Inspiration section
<div className="border-sketch bg-accent-yellow/10 p-6 mb-6">
  <h3 className="font-hand text-xl mb-4">Need Inspiration?</h3>
  <div className="flex flex-wrap gap-2">
    {examplePrompts.map(example => (
      <button
        onClick={() => setPrompt(example)}
        className="px-3 py-1 bg-white border-sketch text-sm hover:bg-sketch"
      >
        {example}
      </button>
    ))}
  </div>
</div>
```

---

## SHARED COMPONENTS

### 1. Header/Navigation
```tsx
// components/layout/Header.tsx
<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-sketch">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-12 h-12 border-sketch p-1">
          <TrogdorIcon className="w-full h-full group-hover:animate-wiggle" />
        </div>
        <span className="font-hand text-2xl hidden md:block">
          Trogdor the Burninator
        </span>
      </Link>
      
      {/* Navigation */}
      <nav className="hidden md:flex gap-6">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/history">History</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/generator">Generator</NavLink>
        <NavLink href="/leaderboard">Leaderboard</NavLink>
      </nav>
      
      {/* Wallet Button */}
      <div>
        {isConnected ? (
          <div className="flex items-center gap-3">
            <Link 
              href={`/profile/${address}`}
              className="flex items-center gap-2 px-4 py-2 border-sketch hover:bg-sketch"
            >
              <div className="w-8 h-8 rounded-full bg-accent-green" />
              <span className="font-mono text-sm">
                {truncateAddress(address)}
              </span>
            </Link>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-sketch">
            Connect Wallet
          </button>
        )}
      </div>
      
      {/* Mobile Menu */}
      <button className="md:hidden">
        <MenuIcon />
      </button>
    </div>
  </div>
</header>
```

### 2. Footer
```tsx
// components/layout/Footer.tsx
<footer className="border-t-2 border-sketch bg-sketch-light mt-20">
  <div className="container mx-auto px-4 py-12">
    <div className="grid md:grid-cols-4 gap-8">
      {/* About */}
      <div>
        <h3 className="font-hand text-2xl mb-4">About</h3>
        <p className="text-sm text-pencil">
          The Cult of Trogdor the Burninator. 
          Every account is a ledger entry. 
          Burninate together.
        </p>
      </div>
      
      {/* Links */}
      <div>
        <h3 className="font-hand text-2xl mb-4">Links</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/history">History & Lore</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/generator">Image Generator</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
        </ul>
      </div>
      
      {/* Community */}
      <div>
        <h3 className="font-hand text-2xl mb-4">Community</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="https://twitter.com/...">Twitter</a></li>
          <li><a href="https://discord.gg/...">Discord</a></li>
          <li><a href="https://t.me/...">Telegram</a></li>
        </ul>
      </div>
      
      {/* Stats */}
      <div>
        <h3 className="font-hand text-2xl mb-4">Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Cult Members</span>
            <span className="font-bold">{stats.users}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Offerings</span>
            <span className="font-bold text-accent-green">
              {stats.offerings}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Images Generated</span>
            <span className="font-bold">{stats.images}</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Copyright */}
    <div className="mt-12 pt-8 border-t border-sketch text-center text-sm text-pencil-light">
      <p>
        Trogdor the Burninator © 2003-2025 The Brothers Chaps. 
        This is a fan tribute project.
      </p>
      <p className="mt-2">
        Built with 🔥 by the cult
      </p>
    </div>
  </div>
</footer>
```

### 3. Loading States
```tsx
// components/ui/LoadingSpinner.tsx
<div className="flex items-center justify-center p-12">
  <div className="relative w-24 h-24">
    {/* Hand-drawn spinner */}
    <div className="absolute inset-0 border-4 border-sketch border-t-accent-red rounded-full animate-spin" />
    <div className="absolute inset-2 border-2 border-sketch border-t-accent-yellow rounded-full animate-spin animation-delay-150" />
    <div className="absolute inset-4 border-2 border-sketch border-t-accent-green rounded-full animate-spin animation-delay-300" />
  </div>
</div>
```

### 4. Toast Notifications
```tsx
// Hand-drawn toast style
<div className="fixed bottom-4 right-4 z-50">
  {toasts.map(toast => (
    <div 
      key={toast.id}
      className={`mb-2 p-4 border-sketch bg-white shadow-sketch-lg max-w-md ${
        toast.type === 'success' ? 'border-l-4 border-l-accent-green' :
        toast.type === 'error' ? 'border-l-4 border-l-accent-red' :
        ''
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">
          {toast.type === 'success' ? '✅' : 
           toast.type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <div className="flex-1">
          <div className="font-hand text-lg">{toast.title}</div>
          <div className="text-sm text-pencil mt-1">{toast.message}</div>
        </div>
        <button onClick={() => dismissToast(toast.id)}>✕</button>
      </div>
    </div>
  ))}
</div>
```

---

## ANIMATION GUIDE

### Micro-interactions
1. **Hover effects**: Slight wiggle (0.3s ease)
2. **Button clicks**: Translate down 2px
3. **Card hover**: Shadow grows
4. **Image loading**: Fade in from sketch lines
5. **Number counters**: Count up animation
6. **Burnination**: Flame flicker effect

### Page transitions
- Fade in: 300ms
- Slide up: 400ms cubic-bezier
- Maintain hand-drawn aesthetic (no smooth transitions)

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile-first approach */
- xs: 0px (default)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

/* Key responsive behaviors */
- Navigation: Hamburger menu < md
- Leaderboard: Stack table on mobile
- Product grid: 1 col mobile, 2 tablet, 3 desktop
- Stats cards: 2x2 mobile, 4x1 desktop
```

---

## ACCESSIBILITY CONSIDERATIONS

1. **Keyboard navigation**: All interactive elements
2. **Focus states**: Visible outline (sketch style)
3. **Alt text**: All images with descriptive text
4. **ARIA labels**: Buttons and links
5. **Color contrast**: Meet WCAG AA standards
6. **Screen readers**: Semantic HTML

---

## PERFORMANCE TARGETS

- **Lighthouse Score**: >90
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.5s
- **Cumulative Layout Shift**: <0.1

---

This UI specification should give you and Cursor everything needed to build out the frontend with pixel-perfect hand-drawn aesthetics while maintaining modern UX standards. Every component maintains the Excalidraw/notebook aesthetic while being fully functional and accessible.
