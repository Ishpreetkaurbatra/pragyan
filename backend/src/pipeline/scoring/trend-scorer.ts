import { TimeSeriesMetrics, TrendScore } from '../../models/intelligence-pipeline.types';

export class TrendScorer {
  /**
   * Calculates a 100% deterministic composite momentum score.
   * GEMINI MUST NOT invent or alter this score.
   *
   * Weights:
   * - Growth Rate:             25%
   * - Acceleration:            20%
   * - Cross-Source Conf:       20%
   * - Persistence:             15%
   * - Recency:                 10%
   * - Geographic Spread:        5%
   * - Source Quality:           5%
   */
  public calculateScore(metrics: TimeSeriesMetrics, averageSourceQuality: number = 0.85): TrendScore {
    // 1. Growth Score (25% weight): Maps growth rates from 0% -> +100% to 0 -> 100 pts
    // e.g. +40% growth -> 70 pts; +80% growth -> 95 pts
    const clampedGrowth = Math.max(-0.5, Math.min(2.0, metrics.growthRate));
    let rawGrowthScore = 50 + (clampedGrowth * 50);
    rawGrowthScore = Math.max(0, Math.min(100, rawGrowthScore));

    // 2. Acceleration Score (20% weight):
    // Positive acceleration is rewarded; negative is penalized
    let rawAccelerationScore = 50 + (metrics.acceleration * 2.5);
    rawAccelerationScore = Math.max(0, Math.min(100, rawAccelerationScore));

    // 3. Cross-Source Score (20% weight):
    const rawCrossSourceScore = Math.round(metrics.crossSourceConfirmation * 100);

    // 4. Persistence Score (15% weight):
    const rawPersistenceScore = Math.round(metrics.persistence * 100);

    // 5. Recency Score (10% weight):
    // 0 days old -> 100 pts; 30+ days old -> 10 pts
    const rawRecencyScore = Math.max(10, Math.round(100 - (metrics.recencyDays * 3.0)));

    // 6. Geographic Spread Score (5% weight):
    const rawGeographicScore = Math.round(metrics.geographicSpread * 100);

    // 7. Source Quality Score (5% weight):
    const rawSourceQualityScore = Math.round(Math.max(0, Math.min(1.0, averageSourceQuality)) * 100);

    // Weighted composite sum
    const totalScore = Math.round(
      rawGrowthScore * 0.25 +
      rawAccelerationScore * 0.20 +
      rawCrossSourceScore * 0.20 +
      rawPersistenceScore * 0.15 +
      rawRecencyScore * 0.10 +
      rawGeographicScore * 0.05 +
      rawSourceQualityScore * 0.05
    );

    return {
      growthScore: Math.round(rawGrowthScore),
      accelerationScore: Math.round(rawAccelerationScore),
      crossSourceScore: rawCrossSourceScore,
      persistenceScore: rawPersistenceScore,
      recencyScore: rawRecencyScore,
      geographicSpreadScore: rawGeographicScore,
      sourceQualityScore: rawSourceQualityScore,
      totalScore: Math.max(1, Math.min(100, totalScore)),
    };
  }
}
