import { getRepository } from '../repositories';
import { Business } from '../models/types';

export class BusinessService {
  private repo = getRepository();

  public async getProfile(userId?: string) {
    const profiles = await this.repo.getAllProfiles();
    return (userId ? await this.repo.getProfileById(userId) : null) || profiles[0];
  }

  public async getBusinessByOwner(ownerId?: string) {
    const profile = await this.getProfile(ownerId);
    let business = await this.repo.getBusinessByOwnerId(profile.id);
    if (!business) {
      const all = await this.repo.getAllBusinesses();
      business = all[0];
    }
    return business;
  }

  public async createOrUpdateBusiness(data: Partial<Business>, ownerId?: string) {
    const profile = await this.getProfile(ownerId);
    let existing = await this.repo.getBusinessByOwnerId(profile.id);
    if (existing) {
      return await this.repo.updateBusiness(existing.id, data);
    } else {
      return await this.repo.createBusiness({
        ...data,
        owner_id: profile.id,
      });
    }
  }
}
