import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@config';
import { sendError } from '@utils/response';

interface JwtPayload {
    id: string;
    role: string;
}

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendError(res, 'Not authorized, no token provided', 401);
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
     ) as unknown as JwtPayload;
     req.userId = decoded.id;
     req.userRole = decoded.role;
     next();
   } catch (_error) {
     sendError(res, 'Not authorized, invalid token', 401);
   }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.userRole !== 'admin') {
        sendError(res, 'Access denied, admin only', 403);
        return;
    }
    next();
};
