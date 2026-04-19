// src/middleware/auth.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@config';
import { sendError } from '@utils/response';
import { AuthRequest, JwtPayload } from '@types'; // ✅ Points to your barrel index.ts

/**
 * Protect Middleware
 * Handles session validation via HttpOnly cookies or Bearer tokens.
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // 1. Check cookies (using the typed 'cookies' property from your interface)
  if (req.cookies?.token) {
    token = req.cookies.token;
  } 
  // 2. Fallback to Authorization header
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Authentication required. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt.secret as string
    ) as unknown as JwtPayload;

    // Attach verified data to the request
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    return sendError(res, 'Your session has expired. Please log in again.', 401);
  }
};

/**
 * Authorization: Admin Only
 * Restricts access to super-admins or sub-admins.
 */
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const isAdmin = req.userRole === 'admin' || req.userRole === 'super-admin';

  if (!isAdmin) {
    return sendError(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};
