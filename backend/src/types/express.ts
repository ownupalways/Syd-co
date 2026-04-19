// src/types/express.ts
import { Request } from 'express';

export interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  // Specific to the Sydney Shopping admin workflow
  adminRole?: 'sub-admin' | 'super-admin';
  adminName?: string;
  cookies: Record<string, string | undefined>;
}
