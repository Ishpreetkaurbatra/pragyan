import { Request, Response } from 'express';
import { getRepository } from '../repositories';
import { UserRole } from '../models/types';

export class AuthController {
  private repo = getRepository();

  public getMe = async (req: Request, res: Response) => {
    const user = req.user;
    const profile = user ? await this.repo.getProfileById(user.id) : null;
    const businesses = user ? await this.repo.getAllBusinesses() : [];
    const userBusiness = businesses.find(b => b.owner_id === user?.id) || businesses[0];

    return res.json({
      success: true,
      data: {
        user: profile || user,
        business: userBusiness || null,
      },
      meta: { requestId: res.locals.requestId },
    });
  };

  public login = async (req: Request, res: Response) => {
    const { email, role } = req.body;
    const profiles = await this.repo.getAllProfiles();
    let profile = profiles.find(p => p.email.toLowerCase() === (email || '').toLowerCase());
    
    if (!profile) {
      profile = profiles[0]; // Fallback to Gayatri Patil in demo mode
    }

    return res.json({
      success: true,
      data: {
        token: `demo-token-${profile.id}`,
        user: profile,
      },
      meta: { requestId: res.locals.requestId },
    });
  };

  public register = async (req: Request, res: Response) => {
    const { email, fullName, role } = req.body;
    const newProfile = await this.repo.createProfile({
      email: email || 'newuser@growthworks.in',
      full_name: fullName || 'New Business Owner',
      role: (role as UserRole) || 'BUSINESS',
    });

    return res.status(201).json({
      success: true,
      data: {
        token: `demo-token-${newProfile.id}`,
        user: newProfile,
      },
      meta: { requestId: res.locals.requestId },
    });
  };

  public switchRole = async (req: Request, res: Response) => {
    const { role } = req.body;
    const profiles = await this.repo.getAllProfiles();
    const target = profiles.find(p => p.role === role) || profiles[0];

    return res.json({
      success: true,
      data: {
        token: `demo-token-${target.id}`,
        user: target,
      },
      meta: { requestId: res.locals.requestId },
    });
  };
}
