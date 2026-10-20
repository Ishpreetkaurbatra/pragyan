import { getRepository } from '../repositories';
import { IntelligenceService } from '../intelligence/intelligence.service';
import { ContextBuilder } from '../intelligence/context.builder';

export class OpportunityService {
  private repo = getRepository();
  private intelligenceService = IntelligenceService.getInstance();

  public async getOpportunities(businessId?: string) {
    return await this.repo.getOpportunities(businessId);
  }

  public async getOpportunityById(id: string) {
    return await this.repo.getOpportunityById(id);
  }

  public async generateOpportunity(businessId: string, trendId: string) {
    const business = await this.repo.getBusinessById(businessId);
    const trend = await this.repo.getTrendById(trendId);
    if (!business || !trend) {
      throw new Error('Business or Trend not found');
    }

    const audiences = await this.repo.getTrendAudiences(trendId);
    const geo = await this.repo.getTrendGeography(trendId);
    const businessContext = ContextBuilder.buildBusinessContext(business);
    const trendContext = ContextBuilder.buildTrendContext(trend, audiences, geo);

    const intResponse = await this.intelligenceService.generateOpportunity({
      businessContext,
      trendContext,
    });

    const oppData = intResponse.data;
    const created = await this.repo.createOpportunity({
      business_id: business.id,
      trend_id: trend.id,
      name: oppData.title,
      description: oppData.description,
      opportunity_score: oppData.score,
      business_fit: oppData.businessFit,
      risk: oppData.risk,
      confidence: oppData.confidence,
      potential_action: oppData.potentialAction,
      status: 'active',
      score_version: 'v1.2',
      intelligence_version: intResponse.intelligenceVersion,
    });

    return {
      opportunity: created,
      meta: intResponse.meta,
    };
  }
}
