import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { User, UserRole } from '../../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'kaam-wala-pakistan-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    const user = db.getUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'User session invalid. Please log in again.' });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is invalid or expired.' });
    return;
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient privileges for this action.' });
      return;
    }
    next();
  };
}
