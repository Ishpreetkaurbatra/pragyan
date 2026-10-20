import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service';

export class AlertController {
  private service = new AlertService();

  public getAlerts = async (req: Request, res: Response) => {
    const { businessId, unread } = req.query as { businessId?: string; unread?: string };
    const alerts = await this.service.getAlerts(businessId, unread === 'true');
    return res.json({
      success: true,
      data: alerts,
      meta: { count: alerts.length, requestId: res.locals.requestId },
    });
  };

  public markAsRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.markAlertRead(id);
    return res.json({
      success: true,
      data: { id, is_read: true },
      meta: { requestId: res.locals.requestId },
    });
  };
}
