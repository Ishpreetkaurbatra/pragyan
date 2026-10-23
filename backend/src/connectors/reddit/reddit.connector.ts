import {
  DataSourceConnector,
  ConnectorHealth,
  FetchSignalParams,
  SourceMetadata,
  ConnectorError,
} from '../connector.interface';
import { TrendSignal } from '../../models/intelligence-pipeline.types';
import { config } from '../../config/env';

export class RedditConnector implements DataSourceConnector {
  public name = 'Reddit API Connector';
  private clientId: string;
  private clientSecret: string;
  private userAgent: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private lastRequestTime = 0;
  private minIntervalMs = 1000; // 60 req/min limit

  constructor() {
    this.clientId = config.redditClientId || '';
    this.clientSecret = config.redditClientSecret || '';
    this.userAgent = config.redditUserAgent || 'TrendToGrowth/1.0';
  }

  public isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret && this.clientId.trim().length > 0);
  }

  public getSourceMetadata(): SourceMetadata {
    const isConf = this.isConfigured();
    return {
      id: 'reddit-connector',
      name: this.name,
      type: 'reddit',
      rateLimitPerMinute: 60,
      requiresAuth: true,
      enabled: isConf,
      status: isConf ? 'ACTIVE' : 'NOT_CONFIGURED',
    };
  }

  public async healthCheck(): Promise<ConnectorHealth> {
    if (!this.isConfigured()) {
      return {
        healthy: false,
        status: 'NOT_CONFIGURED',
        message: 'REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET not configured. Connector disabled.',
      };
    }

    try {
      const startTime = Date.now();
      await this.ensureAuthToken();
      return {
        healthy: true,
        status: 'HEALTHY',
        message: 'Reddit API authentication succeeded.',
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      return {
        healthy: false,
        status: 'ERROR',
        message: err instanceof Error ? err.message : 'Reddit authentication failed',
      };
    }
  }

  private async ensureAuthToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userAgent,
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      throw new Error(`Reddit OAuth failed with status ${res.status}: ${res.statusText}`);
    }

    const json = (await res.json()) as any;
    this.accessToken = json.access_token;
    this.tokenExpiresAt = Date.now() + (json.expires_in * 1000);
    return this.accessToken!;
  }

  public async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minIntervalMs) {
      await new Promise(resolve => setTimeout(resolve, this.minIntervalMs - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  public async fetchSignals(params: FetchSignalParams): Promise<TrendSignal[]> {
    if (!this.isConfigured()) {
      return []; // Graceful disabled mode
    }

    await this.respectRateLimit();
    const token = await this.ensureAuthToken();

    const city = params.city || 'india';
    const kw = params.keywords?.join(' ') || 'trend business';

    // Try city subreddit first, or search r/india if city subreddit does not exist
    const subTarget = city.toLowerCase().replace(/[^a-z0-9]/g, '');
    const searchUrl = `https://oauth.reddit.com/r/${subTarget}/search?q=${encodeURIComponent(kw)}&restrict_sr=1&sort=new&limit=${params.limit || 15}`;

    try {
      let res = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': this.userAgent,
        },
        signal: AbortSignal.timeout(6000),
      });

      // If specific city subreddit 404s (e.g. r/nashik doesn't exist), fall back to r/india with city in query
      if (!res.ok) {
        const fallbackUrl = `https://oauth.reddit.com/r/india/search?q=${encodeURIComponent(`${city} ${kw}`)}&restrict_sr=1&sort=new&limit=${params.limit || 15}`;
        res = await fetch(fallbackUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': this.userAgent,
          },
          signal: AbortSignal.timeout(6000),
        });
      }

      if (!res.ok) {
        throw new Error(`Reddit search failed with status ${res.status}`);
      }

      const json = (await res.json()) as any;
      const children = json.data?.children || [];

      return this.normalize(children.map((c: any) => ({
        ...c.data,
        queryCity: params.city,
        queryState: params.state,
      })));
    } catch (err) {
      console.warn(`[RedditConnector] Fetch failed:`, err);
      return [];
    }
  }

  public normalize(rawItems: unknown[]): TrendSignal[] {
    return (rawItems as any[]).map(raw => {
      const item = raw && raw.data ? { ...raw.data, ...raw } : raw;
      const postId = item.id || `red-${Date.now()}`;
      const title = item.title || 'Untitled Reddit Post';
      const selftext = item.selftext || '';
      const score = item.score || 0;
      const numComments = item.num_comments || 0;
      const permalink = item.permalink ? `https://reddit.com${item.permalink}` : '';

      const keywords = (title + ' ' + selftext)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length > 3)
        .slice(0, 10);

      // Detect city from subreddit or queryCity or text
      let city = item.queryCity;
      if (!city && item.subreddit) {
        const sub = item.subreddit.toLowerCase();
        if (sub === 'pune') city = 'Pune';
        else if (sub === 'nashik') city = 'Nashik';
        else if (sub === 'mumbai') city = 'Mumbai';
        else if (sub === 'bangalore' || sub === 'bengaluru') city = 'Bengaluru';
      }

      return {
        id: `sig-red-${postId}`,
        source: 'reddit',
        sourceRecordId: postId,
        title,
        text: selftext.slice(0, 500),
        url: permalink,
        timestamp: item.created_utc ? new Date(item.created_utc * 1000).toISOString() : new Date().toISOString(),
        collectedAt: new Date().toISOString(),
        location: {
          city,
          state: item.queryState,
          country: 'India',
        },
        category: item.subreddit || 'General',
        keywords,
        engagementMetrics: {
          likes: score,
          comments: numComments,
          score: Math.round(score + numComments * 2),
        },
        rawMetrics: {
          upvoteRatio: item.upvote_ratio || 1,
          score,
          numComments,
        },
        sourceMetadata: {
          subreddit: item.subreddit,
          author: item.author,
        },
        status: 'RAW',
      };
    });
  }

  public handleErrors(error: unknown): ConnectorError {
    return {
      source: 'reddit',
      code: 'REDDIT_CONNECTOR_ERROR',
      message: error instanceof Error ? error.message : 'Unknown Reddit connector error',
      recoverable: true,
    };
  }
}
