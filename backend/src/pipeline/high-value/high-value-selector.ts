import { TrendCluster, BusinessFit } from '../../models/intelligence-pipeline.types';

export interface EvaluatedTrend {
  cluster: TrendCluster;
  locationRelevance: number;
  businessFit: BusinessFit;
  selectionScore: number;
}

export class HighValueSelector {
  /**
   * Filters and selects only high-value trends for AI interpretation.
   * Ranks candidates by:
   * - Business Fit (40%)
   * - Trend Momentum Score (35%)
   * - Location Relevance (25%)
   */
  public selectHighValueTrends(
    candidates: Array<{ cluster: TrendCluster; locationRelevance: number; businessFit: BusinessFit }>,
    maxLimit: number = 5
  ): EvaluatedTrend[] {
    const scored = candidates.map(c => {
      const selectionScore = Math.round(
        c.businessFit.totalScore * 0.40 +
        c.cluster.trendScore.totalScore * 0.35 +
        c.locationRelevance * 0.25
      );

      return {
        ...c,
        selectionScore,
      };
    });

    // Sort descending by selection score
    scored.sort((a, b) => b.selectionScore - a.selectionScore);

    return scored.slice(0, maxLimit);
  }
}
