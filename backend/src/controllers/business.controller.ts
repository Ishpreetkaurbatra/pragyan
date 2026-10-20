import { Request, Response } from 'express';
import { BusinessService } from '../services/business.service';

export class BusinessController {
  private service = new BusinessService();

  public getProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const profile = await this.service.getProfile(userId);
    const business = await this.service.getBusinessByOwner(userId);

    return res.json({
      success: true,
      data: {
        profile,
        business,
      },
      meta: { requestId: res.locals.requestId },
    });
  };

  public saveProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const body = req.body;
    const business = await this.service.createOrUpdateBusiness(body, userId);

    return res.json({
      success: true,
      data: business,
      meta: { requestId: res.locals.requestId },
    });
  };
}
