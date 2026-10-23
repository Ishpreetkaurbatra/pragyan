import { TrendSignal } from '../models/intelligence-pipeline.types';

export interface ConnectorHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DISABLED' | 'ERROR' | 'NOT_CONFIGURED';
  healthy: boolean;
  message?: string;
  latencyMs?: number;
}

export interface FetchSignalParams {
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  categories?: string[];
  keywords?: string[];
  startTime?: string;
  endTime?: string;
  since?: string;
  limit?: number;
}

export interface SourceMetadata {
  id: string;
  name: string;
  type: 'demo' | 'youtube' | 'reddit' | 'news' | 'google-trends';
  rateLimitPerMinute: number;
  requiresAuth: boolean;
  enabled: boolean;
  status?: 'ACTIVE' | 'NOT_CONFIGURED' | 'DEGRADED' | 'FAILED';
  lastSuccessfulRun?: string;
  lastError?: string;
}

export interface ConnectorError {
  source: string;
  code: string;
  message: string;
  recoverable: boolean;
}

export interface DataSourceConnector {
  name: string;
  isConfigured(): boolean;
  healthCheck(): Promise<ConnectorHealth>;
  fetchSignals(params: FetchSignalParams): Promise<TrendSignal[]>;
  normalize(data: unknown[]): TrendSignal[];
  getSourceMetadata(): SourceMetadata;
  respectRateLimit(): Promise<void>;
  handleErrors(error: unknown): ConnectorError;
}
