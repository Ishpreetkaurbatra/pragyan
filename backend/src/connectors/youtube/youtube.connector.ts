import {
  DataSourceConnector,
  ConnectorHealth,
  FetchSignalParams,
  SourceMetadata,
  ConnectorError,
} from '../connector.interface';
import { TrendSignal } from '../../models/intelligence-pipeline.types';
import { config } from '../../config/env';

export class YouTubeConnector implements DataSourceConnector {
  public name = 'YouTube Data API v3';
  private apiKey: string;
  private lastRequestTime = 0;
  private minIntervalMs = 200; // 300 req/min rate limiting

  constructor(apiKey?: string) {
    this.apiKey = apiKey || config.youtubeApiKey || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public getSourceMetadata(): SourceMetadata {
    const isConf = this.isConfigured();
    return {
      id: 'youtube-connector',
      name: this.name,
      type: 'youtube',
      rateLimitPerMinute: 300,
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
        message: 'YOUTUBE_API_KEY is not configured. Connector is disabled.',
      };
    }

    try {
      const startTime = Date.now();
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&key=${this.apiKey}`, {
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        return {
          healthy: false,
          status: 'ERROR',
          message: `YouTube API returned status ${res.status}: ${res.statusText}`,
          latencyMs,
        };
      }

      return {
        healthy: true,
        status: 'HEALTHY',
        message: 'YouTube Data API v3 connection verified.',
        latencyMs,
      };
    } catch (err) {
      return {
        healthy: false,
        status: 'ERROR',
        message: err instanceof Error ? err.message : 'Unknown YouTube connection error',
      };
    }
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

    const query = [
      params.city || '',
      ...(params.keywords || []),
      'trending',
      'review',
    ].filter(Boolean).join(' ');

    const maxResults = Math.min(params.limit || 15, 25);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&order=date&regionCode=IN&key=${this.apiKey}`;

    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(6000) });
    if (!searchRes.ok) {
      throw new Error(`YouTube search failed with status ${searchRes.status}: ${searchRes.statusText}`);
    }

    const searchJson = (await searchRes.json()) as any;
    const items = searchJson.items || [];

    if (items.length === 0) return [];

    // Fetch video statistics
    const videoIds = items.map((it: any) => it.id?.videoId).filter(Boolean).join(',');
    let statsMap: Record<string, any> = {};

    if (videoIds) {
      await this.respectRateLimit();
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${this.apiKey}`;
      const statsRes = await fetch(statsUrl);
      if (statsRes.ok) {
        const statsJson = (await statsRes.json()) as any;
        (statsJson.items || []).forEach((item: any) => {
          statsMap[item.id] = item.statistics;
        });
      }
    }

    return this.normalize(items.map((item: any) => ({
      ...item,
      statistics: statsMap[item.id?.videoId] || {},
      queryLocation: {
        city: params.city,
        state: params.state,
        country: params.country || 'India',
      },
    })));
  }

  public normalize(rawItems: unknown[]): TrendSignal[] {
    return (rawItems as any[]).map(item => {
      const vidId = item.id?.videoId || item.id || `yt-${Date.now()}`;
      const snippet = item.snippet || {};
      const stats = item.statistics || {};
      const views = parseInt(stats.viewCount || '0', 10);
      const likes = parseInt(stats.likeCount || '0', 10);
      const comments = parseInt(stats.commentCount || '0', 10);

      const title = snippet.title || 'Untitled YouTube Video';
      const description = snippet.description || '';

      const keywords = (title + ' ' + description)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length > 3)
        .slice(0, 10);

      return {
        id: `sig-yt-${vidId}`,
        source: 'youtube',
        sourceRecordId: vidId,
        title,
        text: description,
        url: `https://www.youtube.com/watch?v=${vidId}`,
        timestamp: snippet.publishedAt || new Date().toISOString(),
        collectedAt: new Date().toISOString(),
        location: item.queryLocation,
        category: snippet.categoryId || 'General',
        keywords,
        engagementMetrics: {
          views,
          likes,
          comments,
          score: Math.round(likes * 2 + comments * 5 + views * 0.01),
        },
        rawMetrics: {
          viewCount: views,
          likeCount: likes,
          commentCount: comments,
        },
        sourceMetadata: {
          channelId: snippet.channelId,
          channelTitle: snippet.channelTitle,
        },
        status: 'RAW',
      };
    });
  }

  public handleErrors(error: unknown): ConnectorError {
    return {
      source: 'youtube',
      code: 'YOUTUBE_API_ERROR',
      message: error instanceof Error ? error.message : 'Unknown YouTube error',
      recoverable: true,
    };
  }
}
