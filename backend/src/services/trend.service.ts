import { getRepository } from '../repositories';

export class TrendService {
  private repo = getRepository();

  public async getTrends(filter?: { category?: string; search?: string; status?: string }) {
    return await this.repo.getAllTrends(filter);
  }

  public async getTrendById(id: string) {
    return await this.repo.getTrendById(id);
  }

  public async getTrendBySlug(slug: string) {
    return await this.repo.getTrendBySlug(slug);
  }

  public async getTrendSignals(trendId: string) {
    return await this.repo.getTrendSignals(trendId);
  }

  public async getTrendMetrics(trendId: string, period?: string) {
    return await this.repo.getTrendMetrics(trendId, period);
  }

  public async getTrendAudience(trendId: string) {
    return await this.repo.getTrendAudiences(trendId);
  }

  public async getTrendGeography(trendId: string) {
    return await this.repo.getTrendGeography(trendId);
  }

  public async getSources() {
    return await this.repo.getDataSources();
  }

  public async saveTrend(userId: string, trendId: string) {
    return await this.repo.saveTrend(userId, trendId);
  }

  public async unsaveTrend(userId: string, trendId: string) {
    return await this.repo.unsaveTrend(userId, trendId);
  }

  public async getSavedTrends(userId: string) {
    return await this.repo.getSavedTrends(userId);
  }
}
