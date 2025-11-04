/**
 * TwitterAPI.io Client
 * Handles all Twitter API interactions for mention tracking
 */

import type {
  TwitterSearchResponse,
  TwitterTweet,
  TwitterUser,
  TwitterApiError,
} from './twitter-types';

export class TwitterApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.twitterapi.io';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TWITTER_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('TWITTER_API_KEY environment variable is required');
    }
  }

  /**
   * Make a request to TwitterAPI.io
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🌐 Twitter API Request: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: TwitterApiError = {
        error: 'API Error',
        message: `Twitter API request failed: ${response.statusText}`,
        status: response.status,
      };
      
      try {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        error.message = errorData.message || error.message;
      } catch (e) {
        console.error('Failed to parse error response');
      }
      
      console.error(`❌ Request failed: ${url}`);
      throw new Error(error.message);
    }

    return response.json();
  }

  /**
   * Get tweets mentioning a specific user
   * @param username - The username to get mentions for (without @)
   * @param options - Search options
   */
  async searchMentions(
    username: string,
    options: {
      cursor?: string;
      sinceTime?: number; // Unix timestamp in seconds
      untilTime?: number; // Unix timestamp in seconds
    } = {}
  ): Promise<TwitterSearchResponse> {
    const params = new URLSearchParams({
      userName: username,
    });

    if (options.cursor) {
      params.append('cursor', options.cursor);
    }
    
    if (options.sinceTime) {
      params.append('sinceTime', options.sinceTime.toString());
    }
    
    if (options.untilTime) {
      params.append('untilTime', options.untilTime.toString());
    }

    // TwitterAPI.io mentions endpoint
    const endpoint = `/twitter/user/mentions?${params.toString()}`;
    
    return this.request<TwitterSearchResponse>(endpoint);
  }

  /**
   * Get a single tweet by ID
   */
  async getTweet(tweetId: string): Promise<{ data: TwitterTweet }> {
    const params = new URLSearchParams({
      'tweet.fields': 'id,text,author_id,created_at,entities,public_metrics',
      'user.fields': 'id,username,name,verified',
      expansions: 'author_id',
    });

    const endpoint = `/twitter/tweet/${tweetId}?${params.toString()}`;
    return this.request<{ data: TwitterTweet }>(endpoint);
  }

  /**
   * Get user information by username (screen name)
   * Returns user info including their Twitter ID
   */
  async getUserByUsername(username: string): Promise<{ data: TwitterUser }> {
    // Remove @ if present
    const cleanUsername = username.replace('@', '');
    
    const params = new URLSearchParams({
      userName: cleanUsername,
      // Request additional user fields including profile image
      'user.fields': 'profile_image_url,public_metrics,verified',
    });

    const endpoint = `/twitter/user/info?${params.toString()}`;
    return this.request<{ data: TwitterUser }>(endpoint);
  }

  /**
   * Get user information by ID
   */
  async getUserById(userId: string): Promise<{ data: TwitterUser }> {
    const params = new URLSearchParams({
      // Request additional user fields including profile image
      'user.fields': 'profile_image_url,public_metrics,verified',
    });
    
    const endpoint = `/twitter/user/${userId}?${params.toString()}`;
    return this.request<{ data: TwitterUser }>(endpoint);
  }
}

// Export singleton instance (lazy initialization)
let _twitterApi: TwitterApiClient | null = null;

export function getTwitterApi(): TwitterApiClient {
  if (!_twitterApi) {
    _twitterApi = new TwitterApiClient();
  }
  return _twitterApi;
}

// Legacy export for backwards compatibility
export const twitterApi = {
  get searchMentions() { return getTwitterApi().searchMentions.bind(getTwitterApi()); },
  get getTweet() { return getTwitterApi().getTweet.bind(getTwitterApi()); },
  get getUserByUsername() { return getTwitterApi().getUserByUsername.bind(getTwitterApi()); },
  get getUserById() { return getTwitterApi().getUserById.bind(getTwitterApi()); },
};

