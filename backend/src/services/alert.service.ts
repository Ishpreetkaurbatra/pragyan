import { getRepository } from '../repositories';

export class AlertService {
  private repo = getRepository();

  public async getAlerts(businessId?: string, unreadOnly?: boolean) {
    const businesses = await this.repo.getAllBusinesses();
    const bId = businessId || (businesses[0] ? businesses[0].id : 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    return await this.repo.getAlerts(bId, unreadOnly);
  }

  public async markAlertRead(alertId: string) {
    return await this.repo.markAlertRead(alertId);
  }
}
