import { getRepository } from '../repositories';
import { IntelligenceService } from '../intelligence/intelligence.service';
import { ContextBuilder } from '../intelligence/context.builder';

export class AskTGService {
  private repo = getRepository();
  private intelligenceService = IntelligenceService.getInstance();

  public async ask(question: string, businessId?: string) {
    const businesses = await this.repo.getAllBusinesses();
    const business = (businessId ? await this.repo.getBusinessById(businessId) : null) || businesses[0];
    if (!business) throw new Error('Business profile required to contextualize answer');

    const businessContext = ContextBuilder.buildBusinessContext(business);
    const trends = await this.repo.getAllTrends();
    const opportunities = await this.repo.getOpportunities(business.id);
    const experiments = await this.repo.getExperiments(business.id);

    const relevantTrendContexts = trends.slice(0, 3).map(t => ContextBuilder.buildTrendContext(t));

    const intResponse = await this.intelligenceService.answerBusinessQuestion({
      question,
      businessContext,
      relevantTrends: relevantTrendContexts,
      pastExperiments: experiments,
    });

    return intResponse;
  }
}
