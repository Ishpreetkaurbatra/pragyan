import { Business, Trend, Opportunity, Experiment, Audience, GeographicSignal } from '../models/types';
import { BusinessContext, TrendContext } from './intelligence.interface';

export class ContextBuilder {
  public static buildBusinessContext(business: Business): BusinessContext {
    return {
      businessId: business.id,
      businessName: business.business_name,
      industry: business.industry,
      businessType: business.business_type,
      location: business.location,
      targetMarket: business.target_market,
      businessGoal: business.business_goal,
      products: business.products_services || [],
      targetCustomers: business.target_customers,
      budget: business.budget,
      platforms: business.platforms || [],
    };
  }

  public static buildTrendContext(
    trend: Trend,
    audiences: Audience[] = [],
    geography: GeographicSignal[] = [],
    signals: any[] = []
  ): TrendContext {
    return {
      trendId: trend.id,
      name: trend.name,
      category: trend.category,
      momentum: trend.momentum,
      lifecycleStatus: trend.lifecycle_status,
      headline: trend.headline,
      description: trend.description,
      audience: audiences,
      geography: geography,
      signals: signals,
    };
  }

  public static formatForPrompt(
    businessContext: BusinessContext,
    trendContext?: TrendContext,
    experiments?: Experiment[]
  ): string {
    let contextStr = `BUSINESS CONTEXT:\n- Name: ${businessContext.businessName}\n- Industry: ${businessContext.industry}\n- Type: ${businessContext.businessType}\n- Location: ${businessContext.location}\n- Primary Goal: ${businessContext.businessGoal}\n- Products: ${businessContext.products.join(', ')}\n- Target Customers: ${businessContext.targetCustomers || 'General'}\n- Budget Range: ${businessContext.budget || 'Flexible'}\n\n`;

    if (trendContext) {
      contextStr += `TREND CONTEXT:\n- Trend Name: ${trendContext.name}\n- Category: ${trendContext.category}\n- Headline: ${trendContext.headline}\n- Lifecycle: ${trendContext.lifecycleStatus}\n- Description: ${trendContext.description}\n`;
      if (trendContext.audience && trendContext.audience.length > 0) {
        contextStr += `- Demographics: ${trendContext.audience.map(a => `${a.age_group} (${a.percentage}%)`).join(', ')}\n`;
      }
      if (trendContext.geography && trendContext.geography.length > 0) {
        contextStr += `- Key Locations: ${trendContext.geography.map(g => `${g.city || g.state}: score ${g.interest_score}`).join(', ')}\n`;
      }
      contextStr += '\n';
    }

    if (experiments && experiments.length > 0) {
      contextStr += `HISTORICAL EXPERIMENT EVIDENCE:\n`;
      experiments.forEach((exp, idx) => {
        contextStr += `${idx + 1}. [${exp.status.toUpperCase()}] ${exp.name} - Hypothesis: ${exp.hypothesis} (Decision: ${exp.decision || 'in evaluation'})\n`;
      });
      contextStr += '\n';
    }

    return contextStr;
  }
}
