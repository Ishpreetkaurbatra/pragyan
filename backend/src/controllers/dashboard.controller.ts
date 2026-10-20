import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  private service = new DashboardService();

  public getDashboard = async (req: Request, res: Response) => {
    const { businessId } = req.query as { businessId?: string };
    const data = await this.service.getDashboardData(businessId);
    return res.json({
      success: true,
      data,
      meta: { requestId: res.locals.requestId },
    });
  };
}
