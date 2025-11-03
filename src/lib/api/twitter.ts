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
        error.message = errorData.message || error.message;
      } catch (e) {
        // Use default error message
      }
      
      throw new Error(error.message);
    }

    return response.json();
  }

  /**
   * Search for tweets mentioning a specific account
   * @param username - The username to search mentions for (without @)
   * @param options - Search options
   */
  async searchMentions(
    username: string,
    options: {
      maxResults?: number;
      sinceId?: string;
      startTime?: string;
      endTime?: string;
    } = {}
  ): Promise<TwitterSearchResponse> {
    const params = new URLSearchParams({
      query: `@${username}`,
      'tweet.fields': 'id,text,author_id,created_at,entities,public_metrics,referenced_tweets',
      'user.fields': 'id,username,name,verified,public_metrics',
      expansions: 'author_id',
      max_results: (options.maxResults || 100).toString(),
    });

    if (options.sinceId) {
      params.append('since_id', options.sinceId);
    }
    
    if (options.startTime) {
      params.append('start_time', options.startTime);
    }
    
    if (options.endTime) {
      params.append('end_time', options.endTime);
    }

    // TwitterAPI.io endpoint - may need adjustment based on their actual API
    const endpoint = `/twitter/search/recent?${params.toString()}`;
    
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
   * Get user information by username
   */
  async getUserByUsername(username: string): Promise<{ data: TwitterUser }> {
    const endpoint = `/twitter/user/by-username/${username}`;
    return this.request<{ data: TwitterUser }>(endpoint);
  }

  /**
   * Get user information by ID
   */
  async getUserById(userId: string): Promise<{ data: TwitterUser }> {
    const endpoint = `/twitter/user/${userId}`;
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

