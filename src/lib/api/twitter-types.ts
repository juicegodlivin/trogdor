/**
 * TypeScript types for TwitterAPI.io responses
 */

export interface TwitterUser {
  id: string;
  username?: string;
  userName?: string;
  name: string;
  verified?: boolean;
  isBlueVerified?: boolean;
  profile_image_url?: string;
  profilePicture?: string; // TwitterAPI.io format
  coverPicture?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export interface TwitterTweet {
  id: string;
  text: string;
  author_id?: string; // Legacy field for compatibility
  created_at?: string; // Legacy field for compatibility
  createdAt: string; // Actual API field
  author?: {
    id: string;
    userName: string;
    name: string;
    followers: number;
    isVerified: boolean;
    isBlueVerified: boolean;
  };
  conversation_id?: string;
  in_reply_to_user_id?: string;
  retweetCount?: number;
  replyCount?: number;
  likeCount?: number;
  quoteCount?: number;
  viewCount?: number;
  entities?: {
    user_mentions?: Array<{
      id_str: string;
      indices: number[];
      name: string;
      screen_name: string;
    }>;
  };
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count?: number;
  };
}

export interface TwitterSearchResponse {
  tweets?: TwitterTweet[]; // Actual API field
  data?: TwitterTweet[]; // Legacy field for compatibility
  has_next_page?: boolean;
  next_cursor?: string;
  status?: string;
  msg?: string;
  includes?: {
    users?: TwitterUser[];
  };
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
  };
}

export interface TwitterApiError {
  error: string;
  message: string;
  status: number;
}

