import {
  TrendCluster,
  BusinessContext,
  StructuredAiAnalysis,
  Opportunity,
  ActionPlan,
} from '../models/intelligence-pipeline.types';

export class ActionPlanEngine {
  /**
   * Generates ONE primary, concrete, testable action plan for execution.
   */
  public generateActionPlan(
    cluster: TrendCluster,
    business: BusinessContext,
    opportunity: Opportunity,
    aiAnalysis?: StructuredAiAnalysis
  ): ActionPlan {
    const whatToTest = aiAnalysis?.productIdeas?.[0]
      ? `Pilot launch of ${aiAnalysis.productIdeas[0]}`
      : `Launch a limited-time 2-item ${cluster.name} pilot menu / line in ${business.city}`;

    const targetCustomer = aiAnalysis?.targetCustomer ||
      (business.targetCustomers?.[0] ? `${business.targetCustomers[0]} in ${business.city}` : `Local youth and early adopters in ${business.city}`);

    const productOrService = `${cluster.name} Introductory Offering (${business.city} Edition)`;

    const marketingChannel = business.marketingChannels?.[0] ||
      aiAnalysis?.marketingIdeas?.[0] ||
      'In-store table tent cards, Instagram Reels, and local student WhatsApp circles';

    const testDuration = aiAnalysis?.timeline || '14 days';

    const budgetLevel = opportunity.requiredInvestmentLevel === 'LOW'
      ? '₹2,500 – ₹5,000 (Small batch testing)'
      : '₹5,000 – ₹12,000 (Expanded pilot batch)';

    const kpi = 'Daily units sold & repeat order percentage';

    const successThreshold = 'Average 15+ units sold daily with >= 20% repeat customer orders within 14 days';

    const decisionAfterTest = 'If success threshold is achieved, integrate permanently into core offerings and scale procurement. If < 8 units/day, iterate recipe/pricing once; if still below target, sunset pilot without major capital loss.';

    return {
      whatToTest,
      targetCustomer,
      productOrService,
      marketingChannel,
      testDuration,
      budgetLevel,
      kpi,
      successThreshold,
      decisionAfterTest,
    };
  }
}
