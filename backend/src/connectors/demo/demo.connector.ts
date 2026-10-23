import {
  DataSourceConnector,
  ConnectorHealth,
  FetchSignalParams,
  SourceMetadata,
  ConnectorError,
} from '../connector.interface';
import { TrendSignal } from '../../models/intelligence-pipeline.types';
import { generateSyntheticSignalsForCity } from './synthetic-dataset';

export class DemoConnector implements DataSourceConnector {
  public name = 'T→G Synthetic Demo Engine';

  private metadata: SourceMetadata = {
    id: 'demo-connector',
    name: 'T→G Synthetic Demo Engine',
    type: 'demo',
    rateLimitPerMinute: 10000,
    requiresAuth: false,
    enabled: true,
  };

  public isConfigured(): boolean {
    return true;
  }

  public async healthCheck(): Promise<ConnectorHealth> {
    return {
      healthy: true,
      status: 'HEALTHY',
      message: 'DemoConnector operational. Generates deterministic multi-city, multi-week synthetic signals.',
      latencyMs: 1,
    };
  }

  public async fetchSignals(params: FetchSignalParams): Promise<TrendSignal[]> {
    const city = params.city || 'Nashik';
    const state = params.state || 'Maharashtra';
    const country = params.country || 'India';

    const signals = generateSyntheticSignalsForCity(city, state, country);

    if (params.limit && params.limit > 0) {
      return signals.slice(0, params.limit);
    }

    return signals;
  }

  public normalize(data: unknown[]): TrendSignal[] {
    return (data as TrendSignal[]).map(item => ({
      ...item,
      status: 'VALID',
    }));
  }

  public getSourceMetadata(): SourceMetadata {
    return this.metadata;
  }

  public async respectRateLimit(): Promise<void> {
    // In-memory demo requires no throttling
  }

  public handleErrors(error: unknown): ConnectorError {
    return {
      source: 'demo',
      code: 'DEMO_GEN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown demo connector error',
      recoverable: true,
    };
  }
}
