import { Request, Response } from 'express';
import { ActionPlanService } from '../services/action-plan.service';

export class ActionPlanController {
  private service = new ActionPlanService();

  public getActionPlans = async (req: Request, res: Response) => {
    const { businessId } = req.query as { businessId?: string };
    const plans = await this.service.getActionPlans(businessId);
    return res.json({
      success: true,
      data: plans,
      meta: { count: plans.length, requestId: res.locals.requestId },
    });
  };

  public getActionPlanById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await this.service.getActionPlanById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: { code: 'ACTION_PLAN_NOT_FOUND', message: 'Action plan not found.', requestId: res.locals.requestId },
      });
    }
    return res.json({
      success: true,
      data: plan,
      meta: { requestId: res.locals.requestId },
    });
  };

  public generateActionPlan = async (req: Request, res: Response) => {
    const { businessId, trendId, opportunityId } = req.body;
    const result = await this.service.generateActionPlan(businessId, trendId, opportunityId);
    return res.status(201).json({
      success: true,
      data: result.actionPlan,
      meta: { ...result.meta, requestId: res.locals.requestId },
    });
  };

  public submitForReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await this.service.submitForReview(id);
    return res.json({
      success: true,
      data: updated,
      meta: { requestId: res.locals.requestId },
    });
  };
}
