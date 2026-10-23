import { TimeSeriesMetrics, TrendScore, TrendLifecycleStatus } from '../../models/intelligence-pipeline.types';

export class LifecycleClassifier {
  /**
   * Deterministically classifies trend lifecycle based on time-series trajectory and multi-source confirmation.
   * Does NOT rely on AI hallucination.
   */
  public classify(metrics: TimeSeriesMetrics, score: TrendScore): TrendLifecycleStatus {
    const { currentVolume, growthRate, acceleration, crossSourceConfirmation } = metrics;
    const { totalScore } = score;

    // 1. Declining check
    if (growthRate < -0.15 && acceleration < 0) {
      return 'DECLINING';
    }

    // 2. Cooling check
    if (growthRate < 0.05 && currentVolume > 40 && acceleration <= 0) {
      return 'COOLING';
    }

    // 3. Peaking check: Very high mature volume, but velocity leveling off
    if (currentVolume >= 120 && growthRate >= 0 && growthRate <= 0.15 && acceleration <= 0) {
      return 'PEAKING';
    }

    // 4. Rising check: Strong momentum and speeding up
    if (totalScore >= 72 && growthRate >= 0.30 && acceleration >= 0) {
      return 'RISING';
    }

    // 5. Validated check: Multi-source confirmed with solid score
    if (totalScore >= 62 && crossSourceConfirmation >= 0.8) {
      return 'VALIDATED';
    }

    // 6. Validating check: Medium score, gaining cross-source traction
    if (totalScore >= 50 && crossSourceConfirmation >= 0.5) {
      return 'VALIDATING';
    }

    // 7. Emerging check: Early positive growth and velocity
    if (growthRate >= 0.15 || metrics.velocity > 2) {
      return 'EMERGING';
    }

    // 8. Default
    return 'SIGNAL_DETECTED';
  }
}
