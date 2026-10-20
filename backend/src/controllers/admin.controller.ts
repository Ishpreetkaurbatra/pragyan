import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  private service = new AdminService();

  public getOverview = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getUsers = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data: data.users,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getBusinesses = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data: data.businesses,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getTrends = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data: data.trends,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getSources = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data: data.dataSources,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getIntelligence = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data: data.intelligence,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getReviews = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data: data.expertValidation,
      meta: { requestId: res.locals.requestId },
    });
  };

  public getLogs = async (req: Request, res: Response) => {
    const data = await this.service.getAdminOverview();
    return res.json({
      success: true,
      data: data.logs,
      meta: { requestId: res.locals.requestId },
    });
  };
}
