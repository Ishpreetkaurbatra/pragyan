import { Request, Response } from 'express';
import { ExpertService } from '../services/expert.service';

export class ExpertController {
  private service = new ExpertService();

  public getReviews = async (req: Request, res: Response) => {
    const { status } = req.query as { status?: string };
    const list = await this.service.getReviews(status);
    return res.json({
      success: true,
      data: list,
      meta: { count: list.length, requestId: res.locals.requestId },
    });
  };

  public approve = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { comments, suggestedChanges } = req.body;
    const result = await this.service.approve(id, comments, suggestedChanges);
    return res.json({
      success: true,
      data: result,
      meta: { requestId: res.locals.requestId },
    });
  };

  public requestChanges = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { comments, suggestedChanges } = req.body;
    const result = await this.service.requestChanges(id, comments, suggestedChanges);
    return res.json({
      success: true,
      data: result,
      meta: { requestId: res.locals.requestId },
    });
  };

  public reject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { comments, decisionReason } = req.body;
    const result = await this.service.reject(id, comments, decisionReason);
    return res.json({
      success: true,
      data: result,
      meta: { requestId: res.locals.requestId },
    });
  };
}
