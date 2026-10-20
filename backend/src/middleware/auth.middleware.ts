import { Request, Response, NextFunction } from 'express';
import { getRepository } from '../repositories';
import { UserRole } from '../models/types';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const repo = getRepository();
  const authHeader = req.headers.authorization;
  const roleHeader = req.headers['x-demo-role'] as UserRole | undefined;

  const profiles = await repo.getAllProfiles();

  // If a specific role is passed via header in demo mode, switch to that profile
  if (roleHeader) {
    const matchedProfile = profiles.find(p => p.role === roleHeader);
    if (matchedProfile) {
      req.user = {
        id: matchedProfile.id,
        email: matchedProfile.email,
        fullName: matchedProfile.full_name,
        role: matchedProfile.role,
      };
      return next();
    }
  }

  // Default to business owner Gayatri Patil for seamless demo
  const defaultProfile = profiles[0] || {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'gayatri@freshbite.cafe',
    full_name: 'Gayatri Patil',
    role: 'BUSINESS' as UserRole,
  };

  req.user = {
    id: defaultProfile.id,
    email: defaultProfile.email,
    fullName: defaultProfile.full_name,
    role: defaultProfile.role,
  };

  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Action requires one of the following roles: ${roles.join(', ')}`,
          requestId: res.locals.requestId,
        },
      });
    }
    next();
  };
}
