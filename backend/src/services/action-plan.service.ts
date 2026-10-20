import { getRepository } from '../repositories';
import { IntelligenceService } from '../intelligence/intelligence.service';
import { ContextBuilder } from '../intelligence/context.builder';
import { ActionPlan } from '../models/types';

export class ActionPlanService {
  private repo = getRepository();
  private intelligenceService = IntelligenceService.getInstance();

  public async getActionPlans(businessId?: string) {
    return await this.repo.getActionPlans(businessId);
  }

  public async getActionPlanById(id: string) {
    return await this.repo.getActionPlanById(id);
  }

  public async generateActionPlan(businessId: string, trendId: string, opportunityId?: string) {
    const business = await this.repo.getBusinessById(businessId);
    const trend = await this.repo.getTrendById(trendId);
    if (!business || !trend) {
      throw new Error('Business or Trend not found');
    }

    const audiences = await this.repo.getTrendAudiences(trendId);
    const geo = await this.repo.getTrendGeography(trendId);
    const businessContext = ContextBuilder.buildBusinessContext(business);
    const trendContext = ContextBuilder.buildTrendContext(trend, audiences, geo);

    const intResponse = await this.intelligenceService.generateActionPlan({
      businessContext,
      trendContext,
    });

    const planData = intResponse.data;
    const created = await this.repo.createActionPlan({
      business_id: business.id,
      trend_id: trend.id,
      opportunity_id: opportunityId,
      title: planData.title,
      why_now: planData.whyNow,
      why_this_business: planData.whyThisBusiness,
      target_customer: planData.targetCustomer,
      what_to_launch: planData.whatToLaunch,
      suggested_price: planData.suggestedPrice,
      promotion_strategy: planData.promotionStrategy,
      test_timing: planData.testTiming,
      test_duration: planData.testDuration,
      success_metrics: planData.successMetrics,
      risks: planData.risks,
      stop_criteria: planData.stopCriteria,
      continue_criteria: planData.continueCriteria,
      expected_learning: planData.expectedLearning,
      status: 'draft',
      intelligence_version: intResponse.intelligenceVersion,
    });

    return {
      actionPlan: created,
      meta: intResponse.meta,
    };
  }

  public async submitForReview(actionPlanId: string) {
    const plan = await this.repo.getActionPlanById(actionPlanId);
    if (!plan) throw new Error('Action plan not found');

    const updated = await this.repo.updateActionPlan(actionPlanId, { status: 'pending_review' });
    
    // Automatically register in expert review queue
    await this.repo.createOrUpdateExpertReview({
      action_plan_id: actionPlanId,
      status: 'pending',
      risk: 'LOW',
      confidence: 0.90,
    });

    // Alert
    await this.repo.createAlert({
      business_id: plan.business_id,
      trend_id: plan.trend_id,
      alert_type: 'Expert Review Required',
      title: `Plan Submitted: "${plan.title}"`,
      message: 'Your action plan has been queued for human expert validation.',
      severity: 'info',
    });

    return updated;
  }
}
