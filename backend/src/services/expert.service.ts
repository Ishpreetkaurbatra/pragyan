import { getRepository } from '../repositories';

export class ExpertService {
  private repo = getRepository();

  public async getReviews(status?: string) {
    const reviews = await this.repo.getExpertReviews(status);
    const enriched = await Promise.all(
      reviews.map(async (r) => {
        const plan = await this.repo.getActionPlanById(r.action_plan_id);
        const business = plan ? await this.repo.getBusinessById(plan.business_id) : null;
        const trend = plan && plan.trend_id ? await this.repo.getTrendById(plan.trend_id) : null;
        return {
          ...r,
          actionPlan: plan,
          business,
          trend,
        };
      })
    );
    return enriched;
  }

  public async approve(reviewId: string, comments?: string, suggestedChanges?: string) {
    const reviews = await this.repo.getExpertReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Expert review not found');

    const updatedReview = await this.repo.createOrUpdateExpertReview({
      id: review.id,
      action_plan_id: review.action_plan_id,
      status: 'approved',
      comments: comments || 'Approved by human expert.',
      suggested_changes: suggestedChanges,
    });

    // Update action plan status
    await this.repo.updateActionPlan(review.action_plan_id, { status: 'approved' });

    // Notify business via Alert
    const plan = await this.repo.getActionPlanById(review.action_plan_id);
    if (plan) {
      await this.repo.createAlert({
        business_id: plan.business_id,
        trend_id: plan.trend_id,
        alert_type: 'Expert Review Required',
        title: `Plan Approved: "${plan.title}"`,
        message: 'Your action plan was validated by retail strategist Rajesh Kulkarni. Ready to launch experiment!',
        severity: 'high',
      });
    }

    return updatedReview;
  }

  public async requestChanges(reviewId: string, comments: string, suggestedChanges: string) {
    const reviews = await this.repo.getExpertReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Expert review not found');

    const updatedReview = await this.repo.createOrUpdateExpertReview({
      id: review.id,
      action_plan_id: review.action_plan_id,
      status: 'changes_requested',
      comments,
      suggested_changes: suggestedChanges,
    });

    await this.repo.updateActionPlan(review.action_plan_id, { status: 'changes_requested' });

    const plan = await this.repo.getActionPlanById(review.action_plan_id);
    if (plan) {
      await this.repo.createAlert({
        business_id: plan.business_id,
        trend_id: plan.trend_id,
        alert_type: 'Expert Review Required',
        title: `Changes Requested for "${plan.title}"`,
        message: comments,
        severity: 'medium',
      });
    }

    return updatedReview;
  }

  public async reject(reviewId: string, comments: string, decisionReason: string) {
    const reviews = await this.repo.getExpertReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Expert review not found');

    const updatedReview = await this.repo.createOrUpdateExpertReview({
      id: review.id,
      action_plan_id: review.action_plan_id,
      status: 'rejected',
      comments,
      decision_reason: decisionReason,
    });

    await this.repo.updateActionPlan(review.action_plan_id, { status: 'rejected' });
    return updatedReview;
  }
}
