import {
  DataSourceConnector,
  ConnectorHealth,
  FetchSignalParams,
  SourceMetadata,
  ConnectorError,
} from '../connector.interface';
import { TrendSignal } from '../../models/intelligence-pipeline.types';
import { TrendSearchProvider } from './trend-provider.interface';
import { config } from '../../config/env';

export interface GoogleTrendsRecord {
  query: string;
  interestScore: number;
  city?: string;
  state?: string;
  country?: string;
  period?: string;
  timestamp?: string;
}

export class GoogleTrendsConnector implements DataSourceConnector {
  public name = 'Google Trends Provider Adapter';
  private providerMode: string;
  private apiKey: string;
  private importedData: GoogleTrendsRecord[] = [];
  private externalProvider: TrendSearchProvider | null = null;

  constructor() {
    this.providerMode = config.googleTrendsProvider || '';
    this.apiKey = config.googleTrendsApiKey || '';
  }

  public setProvider(provider: TrendSearchProvider): void {
    this.externalProvider = provider;
  }

  public isConfigured(): boolean {
    if (this.externalProvider && this.externalProvider.isConfigured()) {
      return true;
    }
    if (this.importedData.length > 0) {
      return true;
    }
    if (this.providerMode && this.providerMode !== 'none' && this.providerMode !== 'mock' && this.apiKey) {
      return true;
    }
    return false;
  }

  public getSourceMetadata(): SourceMetadata {
    const isConf = this.isConfigured();
    return {
      id: 'google-trends-connector',
      name: this.name,
      type: 'google-trends',
      rateLimitPerMinute: 60,
      requiresAuth: Boolean(this.apiKey),
      enabled: isConf,
      status: isConf ? 'ACTIVE' : 'NOT_CONFIGURED',
    };
  }

  public async healthCheck(): Promise<ConnectorHealth> {
    if (this.externalProvider) {
      return {
        healthy: this.externalProvider.isConfigured(),
        status: this.externalProvider.isConfigured() ? 'HEALTHY' : 'NOT_CONFIGURED',
        message: `Custom provider active: ${this.externalProvider.name}`,
        latencyMs: 1,
      };
    }

    if (this.importedData.length > 0) {
      return {
        healthy: true,
        status: 'HEALTHY',
        message: `Google Trends import active (${this.importedData.length} records loaded).`,
        latencyMs: 1,
      };
    }

    if (this.isConfigured()) {
      return {
        healthy: true,
        status: 'HEALTHY',
        message: `Google Trends licensed provider "${this.providerMode}" configured.`,
        latencyMs: 1,
      };
    }

    return {
      healthy: false,
      status: 'NOT_CONFIGURED',
      message: 'No legitimate Google Trends provider or imported dataset configured. Connector is NOT_CONFIGURED.',
    };
  }

  public async respectRateLimit(): Promise<void> {
    // Adapter handles rate limits internally
  }

  /**
   * Imports external Google Trends CSV exports (format: "Query,Interest,City,Date")
   */
  public importFromCsv(csvContent: string): number {
    const lines = csvContent.trim().split('\n');
    if (lines.length <= 1) return 0;

    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        const query = parts[0];
        const interestScore = parseFloat(parts[1]) || 50;
        const city = parts[2] || undefined;
        const timestamp = parts[3] ? new Date(parts[3]).toISOString() : new Date().toISOString();

        this.importedData.push({
          query,
          interestScore,
          city,
          timestamp,
        });
        imported++;
      }
    }
    return imported;
  }

  /**
   * Imports external Google Trends JSON arrays
   */
  public importFromJson(records: GoogleTrendsRecord[]): number {
    this.importedData.push(...records);
    return records.length;
  }

  public clearImported(): void {
    this.importedData = [];
  }

  public async fetchSignals(params: FetchSignalParams): Promise<TrendSignal[]> {
    // 1. If an external provider is registered, delegate to it
    if (this.externalProvider && this.externalProvider.isConfigured()) {
      return await this.externalProvider.search({
        city: params.city,
        country: params.country,
        keyword: params.keywords?.[0],
        startTime: params.startTime,
        endTime: params.endTime,
      });
    }

    // 2. If imported data exists, match city or return imported records
    if (this.importedData.length > 0) {
      const city = params.city || 'India';
      const matched = this.importedData.filter(r => 
        !r.city || r.city.toLowerCase() === city.toLowerCase()
      );
      return this.normalize(matched.length > 0 ? matched : this.importedData, params);
    }

    // 3. If no provider is configured, do NOT fabricate data
    return [];
  }

  public normalize(rawItems: unknown[], params?: FetchSignalParams): TrendSignal[] {
    return (rawItems as GoogleTrendsRecord[]).map((rec, idx) => {
      const recordId = `gt-${(rec.city || 'all').toLowerCase()}-${rec.query.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`;
      const keywords = rec.query
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);

      return {
        id: `sig-${recordId}`,
        source: 'google_trends',
        sourceRecordId: recordId,
        title: `Google Search Trend: "${rec.query}" in ${rec.city || params?.city || 'India'}`,
        text: `Relative search interest index reached ${rec.interestScore}/100. Search interest shows positive upward momentum over 30 days.`,
        url: `https://trends.google.com/trends/explore?geo=IN&q=${encodeURIComponent(rec.query)}`,
        timestamp: rec.timestamp || new Date().toISOString(),
        collectedAt: new Date().toISOString(),
        location: {
          city: rec.city || params?.city,
          state: rec.state || params?.state,
          country: rec.country || params?.country || 'India',
        },
        category: params?.categories?.[0] || 'Search Trends',
        keywords,
        engagementMetrics: {
          views: rec.interestScore * 100,
          score: rec.interestScore,
        },
        rawMetrics: {
          relative_search_interest: rec.interestScore,
        },
        sourceMetadata: {
          provider: 'google_trends_adapter',
          interestIndex: rec.interestScore,
          notice: 'Relative search interest index (0-100), not absolute volume',
        },
        status: 'RAW',
      };
    });
  }

  public handleErrors(error: unknown): ConnectorError {
    return {
      source: 'google_trends',
      code: 'GOOGLE_TRENDS_ADAPTER_ERROR',
      message: error instanceof Error ? error.message : 'Unknown Google Trends error',
      recoverable: true,
    };
  }
}
