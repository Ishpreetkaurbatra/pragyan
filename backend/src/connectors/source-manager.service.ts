import { DataSourceConnector, ConnectorHealth, SourceMetadata } from './connector.interface';
import { DemoConnector } from './demo/demo.connector';
import { YouTubeConnector } from './youtube/youtube.connector';
import { RedditConnector } from './reddit/reddit.connector';
import { NewsRSSConnector } from './news/news-rss.connector';
import { GoogleTrendsConnector } from './google-trends/google-trends.connector';

export interface ManagedSourceInfo {
  sourceId: string;
  name: string;
  type: string;
  enabled: boolean;
  status: 'ACTIVE' | 'NOT_CONFIGURED' | 'DEGRADED' | 'FAILED';
  lastSuccessfulRun?: string;
  lastError?: string;
  rateLimitPerMinute: number;
  configuration: Record<string, unknown>; // Safe metadata only, never secrets
  createdAt: string;
  updatedAt: string;
}

export class SourceManager {
  private static instance: SourceManager;
  private connectors: Map<string, DataSourceConnector> = new Map();
  private sourceRecords: Map<string, ManagedSourceInfo> = new Map();

  private constructor() {
    this.registerDefaultConnectors();
  }

  public static getInstance(): SourceManager {
    if (!SourceManager.instance) {
      SourceManager.instance = new SourceManager();
    }
    return SourceManager.instance;
  }

  private registerDefaultConnectors(): void {
    const demo = new DemoConnector();
    const yt = new YouTubeConnector();
    const reddit = new RedditConnector();
    const news = new NewsRSSConnector();
    const gt = new GoogleTrendsConnector();

    this.registerConnector('demo-connector', demo, { mode: 'synthetic' });
    this.registerConnector('youtube-connector', yt, { endpoint: 'https://www.googleapis.com/youtube/v3' });
    this.registerConnector('reddit-connector', reddit, { endpoint: 'https://oauth.reddit.com' });
    this.registerConnector('news-rss-connector', news, { feedsCount: 1, provider: 'Google News RSS' });
    this.registerConnector('google-trends-connector', gt, { provider: 'adapter_import' });
  }

  public registerConnector(id: string, connector: DataSourceConnector, safeConfig: Record<string, unknown> = {}): void {
    this.connectors.set(id, connector);
    const meta = connector.getSourceMetadata();
    const now = new Date().toISOString();

    const isConf = connector.isConfigured();
    this.sourceRecords.set(id, {
      sourceId: id,
      name: connector.name,
      type: meta.type,
      enabled: isConf,
      status: isConf ? 'ACTIVE' : 'NOT_CONFIGURED',
      rateLimitPerMinute: meta.rateLimitPerMinute,
      configuration: safeConfig,
      createdAt: now,
      updatedAt: now,
    });
  }

  public getConnector(id: string): DataSourceConnector | undefined {
    return this.connectors.get(id);
  }

  public getAllConnectors(): DataSourceConnector[] {
    return Array.from(this.connectors.values());
  }

  public async getSourceHealth(id: string): Promise<ConnectorHealth | null> {
    const conn = this.connectors.get(id);
    if (!conn) return null;
    return await conn.healthCheck();
  }

  public async getAllSourcesStatus(): Promise<ManagedSourceInfo[]> {
    const results: ManagedSourceInfo[] = [];

    for (const [id, record] of this.sourceRecords.entries()) {
      const conn = this.connectors.get(id);
      let status = record.status;

      if (conn) {
        if (!conn.isConfigured()) {
          status = 'NOT_CONFIGURED';
        } else {
          try {
            const health = await conn.healthCheck();
            if (health.healthy) {
              status = 'ACTIVE';
            } else if (health.status === 'NOT_CONFIGURED') {
              status = 'NOT_CONFIGURED';
            } else if (health.status === 'DEGRADED') {
              status = 'DEGRADED';
            } else {
              status = 'FAILED';
            }
          } catch {
            status = 'FAILED';
          }
        }
      }

      const updated = {
        ...record,
        status,
        updatedAt: new Date().toISOString(),
      };
      this.sourceRecords.set(id, updated);
      results.push(updated);
    }

    return results;
  }

  public recordRun(id: string, success: boolean, errorMessage?: string): void {
    const record = this.sourceRecords.get(id);
    if (!record) return;

    const now = new Date().toISOString();
    if (success) {
      record.lastSuccessfulRun = now;
      record.lastError = undefined;
    } else {
      record.lastError = errorMessage;
      record.status = 'FAILED';
    }
    record.updatedAt = now;
  }

  public recordSuccess(id: string): void {
    this.recordRun(id, true);
  }

  public recordFailure(id: string, errorMessage?: string): void {
    this.recordRun(id, false, errorMessage);
  }
}
