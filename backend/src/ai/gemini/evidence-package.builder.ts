import {
  TrendCluster,
  BusinessContext,
  BusinessFit,
  TrendIntelligencePackage,
} from '../../models/intelligence-pipeline.types';

export class EvidencePackageBuilder {
  /**
   * Constructs the minimal, high-value compact evidence package for Gemini.
   * NEVER sends the raw signal dataset.
   */
  public buildPackage(
    cluster: TrendCluster,
    business: BusinessContext,
    businessFit: BusinessFit
  ): TrendIntelligencePackage {
    // 1. Summarize cross-source observations concisely
    const sourcesSummary = cluster.signals.slice(0, 6).map(sig => ({
      source: sig.source,
      signal: sig.title,
      value: sig.engagementMetrics?.score || sig.engagementMetrics?.views,
    }));

    // 2. Distinct geographies where observed
    const geoLocations = Array.from(new Set(
      cluster.signals.map(s => s.location?.city).filter(Boolean) as string[]
    ));

    return {
      trendId: cluster.id,
      trendName: cluster.name,
      location: {
        city: business.city,
        state: business.state,
        country: business.country || 'India',
      },
      stage: cluster.lifecycle,
      metrics: {
        growth: Math.round(cluster.timeSeries.growthRate * 100), // e.g. +45%
        acceleration: Math.round(cluster.timeSeries.acceleration),
        persistence: Math.round(cluster.timeSeries.persistence * 100),
        crossSource: Math.round(cluster.timeSeries.crossSourceConfirmation * 100),
        totalScore: cluster.trendScore.totalScore,
      },
      sources: sourcesSummary,
      geography: geoLocations.length > 0 ? geoLocations : [business.city],
      business,
      businessFit: {
        score: businessFit.totalScore,
        reasons: businessFit.reasons,
      },
    };
  }
}
