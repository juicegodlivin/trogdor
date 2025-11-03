/**
 * Quality scoring algorithm for Twitter mentions
 * Rewards genuine engagement and quality content
 */

interface MentionMetrics {
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  hasImage: boolean;
  hasVideo: boolean;
  hasHashtags: boolean;
}

interface ScoreBreakdown {
  engagementScore: number;
  contentScore: number;
  viralityScore: number;
  totalScore: number;
}

export function calculateQualityScore(metrics: MentionMetrics): {
  totalScore: number;
  breakdown: ScoreBreakdown;
} {
  // 1. Engagement Score (0-40 points)
  // Weighted: likes (1pt each), retweets (3pt each), replies (2pt each), quotes (5pt each)
  const engagementRaw =
    metrics.likes * 1 +
    metrics.retweets * 3 +
    metrics.replies * 2 +
    metrics.quotes * 5;

  // Logarithmic scaling to prevent mega-viral tweets from dominating
  const engagementScore = Math.min(40, Math.log10(engagementRaw + 1) * 10);

  // 2. Content Score (0-30 points)
  let contentScore = 0;

  // Text length bonus (5-15 points)
  const textLength = metrics.text.length;
  if (textLength >= 50 && textLength <= 280) {
    contentScore += 15; // Optimal length
  } else if (textLength >= 20) {
    contentScore += 10; // Good length
  } else {
    contentScore += 5; // Short but present
  }

  // Media bonus (10 points)
  if (metrics.hasImage) contentScore += 10;
  if (metrics.hasVideo) contentScore += 15; // Video is worth more

  // Hashtag penalty/bonus (5 points)
  if (metrics.hasHashtags) {
    // Count hashtags in text
    const hashtagCount = (metrics.text.match(/#/g) || []).length;
    if (hashtagCount === 1 || hashtagCount === 2) {
      contentScore += 5; // Good use of hashtags
    } else if (hashtagCount > 5) {
      contentScore -= 5; // Hashtag spam
    }
  }

  // Cap content score
  contentScore = Math.max(0, Math.min(30, contentScore));

  // 3. Virality Score (0-30 points)
  // Ratio-based: measures how viral relative to account size
  const totalEngagement = metrics.likes + metrics.retweets + metrics.replies;
  const viralityRatio = totalEngagement > 0 ? metrics.retweets / totalEngagement : 0;

  let viralityScore = 0;
  if (viralityRatio > 0.3) {
    viralityScore = 30; // Extremely viral
  } else if (viralityRatio > 0.2) {
    viralityScore = 25; // Very viral
  } else if (viralityRatio > 0.1) {
    viralityScore = 20; // Moderately viral
  } else if (viralityRatio > 0.05) {
    viralityScore = 15; // Somewhat viral
  } else if (totalEngagement > 0) {
    viralityScore = 10; // Has engagement
  }

  // 4. Calculate total (0-100 scale)
  const totalScore = Math.round(engagementScore + contentScore + viralityScore);

  return {
    totalScore: Math.min(100, totalScore),
    breakdown: {
      engagementScore: Math.round(engagementScore),
      contentScore,
      viralityScore,
      totalScore: Math.min(100, totalScore),
    },
  };
}

/**
 * Determine reward tier based on quality score
 */
export function getRewardTier(score: number): {
  tier: 'legendary' | 'epic' | 'rare' | 'common' | 'peasant';
  emoji: string;
  description: string;
} {
  if (score >= 90) {
    return {
      tier: 'legendary',
      emoji: '🔥👑',
      description: 'Legendary Burninator',
    };
  } else if (score >= 75) {
    return {
      tier: 'epic',
      emoji: '🔥',
      description: 'Epic Burnination',
    };
  } else if (score >= 50) {
    return {
      tier: 'rare',
      emoji: '🐉',
      description: 'Rare Dragon',
    };
  } else if (score >= 25) {
    return {
      tier: 'common',
      emoji: '💚',
      description: 'Common Cultist',
    };
  } else {
    return {
      tier: 'peasant',
      emoji: '🌾',
      description: 'Humble Peasant',
    };
  }
}
