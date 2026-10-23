import { TrendSignal } from '../../models/intelligence-pipeline.types';

export interface TrendSearchProviderParams {
  city?: string;
  country?: string;
  keyword?: string;
  startTime?: string;
  endTime?: string;
}

export interface TrendSearchProvider {
  name: string;
  isConfigured(): boolean;
  search(params: TrendSearchProviderParams): Promise<TrendSignal[]>;
}
