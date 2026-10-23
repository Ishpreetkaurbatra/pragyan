import {
  TrendCluster,
  BusinessContext,
  BusinessFit,
  StructuredAiAnalysis,
  Opportunity,
} from '../models/intelligence-pipeline.types';

export class OpportunityEngine {
  /**
   * Generates a validated Opportunity object.
   * Numerical opportunityScore combines:
   * - Business Fit (35%)
   * - Trend Momentum Score (30%)
   * - Market Timing (15%)
   * - Implementation Feasibility (10%)
   * - Risk Mitigation (10%)
   */
  public generateOpportunity(
    cluster: TrendCluster,
    business: BusinessContext,
    businessFit: BusinessFit,
    aiAnalysis?: StructuredAiAnalysis
  ): Opportunity {
    // 1. Implementation feasibility & investment level
    let implementationDifficulty: 'EASY' | 'MODERATE' | 'COMPLEX' = 'MODERATE';
    let requiredInvestmentLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let feasibilityScore = 80;
    let riskMitigationScore = 80;

    if (cluster.category === 'Technology & AI') {
      implementationDifficulty = 'MODERATE';
      requiredInvestmentLevel = 'MEDIUM';
      riskLevel = 'MEDIUM';
      feasibilityScore = 70;
      riskMitigationScore = 75;
    } else if (cluster.category === 'Food & Beverage') {
      implementationDifficulty = 'EASY';
      requiredInvestmentLevel = 'LOW';
      riskLevel = 'LOW';
      feasibilityScore = 90;
      riskMitigationScore = 85;
    } else if (cluster.category === 'Sustainable Living') {
      implementationDifficulty = 'EASY';
      requiredInvestmentLevel = 'LOW';
      riskLevel = 'LOW';
      feasibilityScore = 85;
      riskMitigationScore = 90;
    }

    // 2. Market timing score
    const timingScore = businessFit.timingFit;

    // 3. Composite numerical score
    const opportunityScore = Math.round(
      businessFit.totalScore * 0.35 +
      cluster.trendScore.totalScore * 0.30 +
      timingScore * 0.15 +
      feasibilityScore * 0.10 +
      riskMitigationScore * 0.10
    );

    const title = aiAnalysis?.opportunity
      ? `Launch ${cluster.name} Pilot: ${aiAnalysis.opportunity.slice(0, 70)}`
      : `Introduce ${cluster.name} for ${business.city} ${business.targetCustomers?.[0] || 'customers'}`;

    const recommendedExperiment = aiAnalysis?.actionPlan?.[0] ||
      `Run a 14-day ${cluster.name} limited trial for ${business.city} customers with a ₹3,000 marketing pilot.`;

    const expectedBenefit = `Capture early ${cluster.name} consumer shift (+${Math.round(cluster.timeSeries.growthRate * 100)}% growth), increase average ticket size, and attract new patrons in ${business.city}.`;

    const expectedLearning = `Determine true conversion rate, optimal pricing, and repeat purchase frequency among ${business.city} patrons.`;

    const successMetrics = aiAnalysis?.successMetrics || [
      'Sell minimum 15 units/day during test period',
      'Achieve >= 45% gross margin contribution',
      '>= 70% positive feedback score from trial customers',
    ];

    return {
      opportunityTitle: title,
      trendId: cluster.id,
      opportunityScore: Math.max(1, Math.min(100, opportunityScore)),
      customerSegment: aiAnalysis?.targetCustomer || business.targetCustomers?.[0] || 'College students and young professionals',
      expectedBenefit,
      requiredInvestmentLevel,
      implementationDifficulty,
      riskLevel,
      recommendedExperiment,
      expectedLearning,
      successMetrics,
    };
  }
}
