import {
  DataSourceConnector,
  ConnectorHealth,
  FetchSignalParams,
  SourceMetadata,
  ConnectorError,
} from '../connector.interface';
import { TrendSignal } from '../../models/intelligence-pipeline.types';
import { XMLParser } from 'fast-xml-parser';

export class NewsRSSConnector implements DataSourceConnector {
  public name = 'News RSS Feeds';
  private parser: XMLParser;
  private feedUrls: string[];
  private lastRequestTime = 0;
  private minIntervalMs = 500;

  constructor(customFeeds?: string[]) {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    this.feedUrls = customFeeds || [
      'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
    ];
  }

  public isConfigured(): boolean {
    return this.feedUrls.length > 0;
  }

  public getSourceMetadata(): SourceMetadata {
    return {
      id: 'news-rss-connector',
      name: this.name,
      type: 'news',
      rateLimitPerMinute: 120,
      requiresAuth: false,
      enabled: true,
      status: 'ACTIVE',
    };
  }

  public async healthCheck(): Promise<ConnectorHealth> {
    try {
      const startTime = Date.now();
      const testUrl = this.feedUrls[0];
      const res = await fetch(testUrl, {
        headers: { 'User-Agent': 'T-to-G-TrendBot/1.0' },
        signal: AbortSignal.timeout(4000),
      });
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        return {
          healthy: false,
          status: 'DEGRADED',
          message: `RSS feed returned status ${res.status}`,
          latencyMs,
        };
      }

      return {
        healthy: true,
        status: 'HEALTHY',
        message: 'News RSS feeds accessible.',
        latencyMs,
      };
    } catch (err) {
      return {
        healthy: false,
        status: 'DEGRADED',
        message: err instanceof Error ? err.message : 'RSS feed fetch timed out or offline',
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
    await this.respectRateLimit();

    const query = [
      params.city || '',
      ...(params.keywords || []),
      'business',
      'trend',
    ].filter(Boolean).join(' ');

    const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;

    try {
      const res = await fetch(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; T-to-G/1.0)' },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        return [];
      }

      const xmlText = await res.text();
      const parsed = this.parser.parse(xmlText);
      const items = parsed?.rss?.channel?.item || [];
      const itemArray = Array.isArray(items) ? items : [items].filter(Boolean);

      const limit = params.limit || 15;
      return this.normalize(itemArray.slice(0, limit), params);
    } catch {
      // Graceful degradation when network/offline
      return [];
    }
  }

  public normalize(rawItems: unknown[], params?: FetchSignalParams): TrendSignal[] {
    return (rawItems as any[]).map((item, idx) => {
      const title = String(item.title || 'Untitled News').replace(/<[^>]+>/g, '').trim();
      const text = String(item.description || '').replace(/<[^>]+>/g, '').trim();
      const link = String(item.link || item.guid || '');
      const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

      const keywords = (title + ' ' + text)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length > 3)
        .slice(0, 10);

      const id = `sig-news-${Date.now()}-${idx}`;
      const guid = typeof item.guid === 'string' ? item.guid : (item.guid && item.guid['#text'] ? item.guid['#text'] : undefined);
      const sourceRecordId = guid || link || id;

      let city = params?.city;
      if (!city) {
        const full = `${title} ${text}`.toLowerCase();
        if (full.includes('pune')) city = 'Pune';
        else if (full.includes('nashik')) city = 'Nashik';
        else if (full.includes('mumbai')) city = 'Mumbai';
        else if (full.includes('bengaluru') || full.includes('bangalore')) city = 'Bengaluru';
      }

      return {
        id,
        source: 'news_rss',
        sourceRecordId,
        title,
        text,
        url: link,
        timestamp: pubDate,
        collectedAt: new Date().toISOString(),
        location: {
          city,
          state: params?.state,
          country: params?.country || 'India',
        },
        category: params?.categories?.[0] || 'Business News',
        keywords,
        engagementMetrics: {
          views: 500,
          shares: 25,
          score: 50,
        },
        rawMetrics: {
          syndicatedCount: 1,
        },
        sourceMetadata: {
          sourceHost: 'news_rss',
          pubDate,
        },
        status: 'RAW',
      };
    });
  }

  public handleErrors(error: unknown): ConnectorError {
    return {
      source: 'news_rss',
      code: 'NEWS_RSS_FETCH_ERROR',
      message: error instanceof Error ? error.message : 'Unknown RSS error',
      recoverable: true,
    };
  }
}
