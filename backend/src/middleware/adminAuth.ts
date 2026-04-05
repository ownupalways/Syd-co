import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@config';
import { AdminUser, AdminRole } from '@models/AdminUser';
import { sendError } from '@utils/response';

interface AdminJwtPayload {
  id: string;
  role: AdminRole;
  email: string;
}

export interface AdminRequest extends Request {
  adminId?: string;
  adminRole?: AdminRole;
  adminName?: string;
  adminEmail?: string;
}

export const adminProtect = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Not authorized', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    sendError(res, 'Invalid token format', 401);
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt.secret as string,
    ) as unknown as AdminJwtPayload;
    const admin = await AdminUser.findById(decoded.id).select('-password');

    if (!admin) {
      sendError(res, 'Admin not found', 401);
      return;
    }
    if (admin.status !== 'active') {
      sendError(res, 'Account not active', 403);
      return;
    }

    // Check if account is locked
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      sendError(res, 'Account temporarily locked', 423);
      return;
    }

    req.adminId = String(admin._id);
    req.adminRole = admin.role;
    req.adminName = admin.name;
    req.adminEmail = admin.email;
    next();
  } catch (_error) {
    sendError(res, 'Invalid token', 401);
  }
};

export const superAdminOnly = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.adminRole !== 'super-admin') {
    sendError(res, 'Super admin access required', 403);
    return;
  }
  next();
};

export const requirePermission = (_permission: string) => (
  req: AdminRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (req.adminRole === 'super-admin') { next(); return; }
  next();
};
