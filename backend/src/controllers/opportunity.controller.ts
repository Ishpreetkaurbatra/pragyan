import { Request, Response } from 'express';
import { OpportunityService } from '../services/opportunity.service';

export class OpportunityController {
  private service = new OpportunityService();

  public getOpportunities = async (req: Request, res: Response) => {
    const { businessId } = req.query as { businessId?: string };
    const list = await this.service.getOpportunities(businessId);
    return res.json({
      success: true,
      data: list,
      meta: { count: list.length, requestId: res.locals.requestId },
    });
  };

  public getOpportunityById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const opp = await this.service.getOpportunityById(id);
    if (!opp) {
      return res.status(404).json({
        success: false,
        error: { code: 'OPPORTUNITY_NOT_FOUND', message: 'Opportunity not found.', requestId: res.locals.requestId },
      });
    }
    return res.json({
      success: true,
      data: opp,
      meta: { requestId: res.locals.requestId },
    });
  };

  public generateOpportunity = async (req: Request, res: Response) => {
    const { businessId, trendId } = req.body;
    const result = await this.service.generateOpportunity(businessId, trendId);
    return res.status(201).json({
      success: true,
      data: result.opportunity,
      meta: { ...result.meta, requestId: res.locals.requestId },
    });
  };
}
