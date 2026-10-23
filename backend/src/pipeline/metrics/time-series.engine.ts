import { TrendSignal, TimeSeriesMetrics } from '../../models/intelligence-pipeline.types';

export class TimeSeriesEngine {
  /**
   * Calculates comprehensive time-series momentum metrics across 4 weekly periods.
   */
  public computeMetrics(signals: TrendSignal[]): TimeSeriesMetrics {
    if (signals.length === 0) {
      return {
        currentVolume: 0,
        previousVolume: 0,
        growthRate: 0,
        velocity: 0,
        acceleration: 0,
        persistence: 0,
        sourceDiversity: 0,
        crossSourceConfirmation: 0,
        geographicSpread: 0,
        recencyDays: 30,
        weeklyVolumes: [0, 0, 0, 0],
      };
    }

    // 1. Group signals into 4 weekly bins
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    // Default buckets [Week 1, Week 2, Week 3, Week 4]
    const weeklyVolumes = [0, 0, 0, 0];
    const weeklyCounts = [0, 0, 0, 0];

    const sourcesSet = new Set<string>();
    const locationsSet = new Set<string>();
    let latestTimestampMs = 0;

    for (const sig of signals) {
      sourcesSet.add(sig.source);
      if (sig.location?.city) {
        locationsSet.add(sig.location.city.toLowerCase());
      }

      const sigTime = new Date(sig.timestamp).getTime();
      if (sigTime > latestTimestampMs) {
        latestTimestampMs = sigTime;
      }

      const ageMs = Math.max(0, now - sigTime);
      const weeksAgo = Math.floor(ageMs / oneWeekMs);

      // Volume weight: engagement score or 1
      const signalVolume = sig.engagementMetrics?.score || 1;

      // Assign to weekly buckets (W4 = latest week, W1 = 3 weeks ago)
      let bucketIdx = 3 - weeksAgo;
      if (bucketIdx < 0) bucketIdx = 0;
      if (bucketIdx > 3) bucketIdx = 3;

      // If synthetic signal already has synthetic_week, honor it
      const synthWeek = sig.rawMetrics?.synthetic_week;
      if (typeof synthWeek === 'number' && synthWeek >= 1 && synthWeek <= 4) {
        bucketIdx = synthWeek - 1;
      }

      weeklyVolumes[bucketIdx] += signalVolume;
      weeklyCounts[bucketIdx] += 1;
    }

    // Ensure non-zero smoothed values
    const w1 = Math.max(weeklyVolumes[0], weeklyCounts[0]);
    const w2 = Math.max(weeklyVolumes[1], weeklyCounts[1]);
    const w3 = Math.max(weeklyVolumes[2], weeklyCounts[2]);
    const w4 = Math.max(weeklyVolumes[3], weeklyCounts[3]);

    const smoothedWeeks: [number, number, number, number] = [
      Math.max(1, w1),
      Math.max(1, w2),
      Math.max(1, w3),
      Math.max(1, w4),
    ];

    const currentVolume = smoothedWeeks[3];
    const previousVolume = smoothedWeeks[2];

    // Growth Rate: relative increase from W3 to W4
    const growthRate = (currentVolume - previousVolume) / Math.max(previousVolume, 1);

    // Velocity: rate of change over the periods (average weekly gain)
    const velocity = (smoothedWeeks[3] - smoothedWeeks[0]) / 3;

    // Acceleration: change in velocity: (W4 - W3) - (W3 - W2)
    const vLatest = smoothedWeeks[3] - smoothedWeeks[2];
    const vPrior = smoothedWeeks[2] - smoothedWeeks[1];
    const acceleration = vLatest - vPrior;

    // Persistence: ratio of periods that maintained or increased volume
    let positiveTransitions = 0;
    if (smoothedWeeks[1] >= smoothedWeeks[0]) positiveTransitions++;
    if (smoothedWeeks[2] >= smoothedWeeks[1]) positiveTransitions++;
    if (smoothedWeeks[3] >= smoothedWeeks[2]) positiveTransitions++;
    const persistence = Number((positiveTransitions / 3).toFixed(2));

    // Source diversity: distinct sources / 4 reference sources (youtube, reddit, news, google_trends)
    const sourceDiversity = Number(Math.min(1.0, sourcesSet.size / 4).toFixed(2));

    // Cross-source confirmation: >= 2 sources confirming is strong (1.0), 1 source is moderate (0.5)
    const crossSourceConfirmation = sourcesSet.size >= 3 ? 1.0 : (sourcesSet.size >= 2 ? 0.8 : 0.4);

    // Geographic spread: count of distinct cities observing signals
    const geographicSpread = Number(Math.min(1.0, Math.max(0.2, locationsSet.size / 3)).toFixed(2));

    // Recency in days
    const recencyDays = latestTimestampMs > 0
      ? Math.max(0, Math.round((now - latestTimestampMs) / (24 * 60 * 60 * 1000)))
      : 1;

    return {
      currentVolume,
      previousVolume,
      growthRate: Number(growthRate.toFixed(3)),
      velocity: Number(velocity.toFixed(2)),
      acceleration: Number(acceleration.toFixed(2)),
      persistence,
      sourceDiversity,
      crossSourceConfirmation,
      geographicSpread,
      recencyDays,
      weeklyVolumes: smoothedWeeks,
    };
  }
}
