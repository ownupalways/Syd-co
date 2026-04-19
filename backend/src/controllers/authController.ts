import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@models/User';
import { hashPassword, comparePassword } from '@utils/helpers';
import { sendSuccess, sendError } from '@utils/response';
import { config } from '@config';

/**
 * Cookie Configuration
 * httpOnly: Prevents JS access (XSS protection)
 * sameSite: 'none' + secure: true is required for cross-domain cookies (Vercel/Render)
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'none' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, config.jwt.secret as string, {
    expiresIn: config.jwt.expire as `${number}${'s' | 'm' | 'h' | 'd'}`,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      sendError(res, 'Name, email and password are required', 400);
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'User with this email already exists', 409);
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = generateToken(user._id.toString(), user.role);

    // Set the secure cookie
    res.cookie('token', token, COOKIE_OPTIONS);

    sendSuccess(res, 'Registration successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 201);
  } catch (error) {
    sendError(res, 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'Email and password are required', 400);
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'No account found with this email', 404);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Your account has been deactivated', 403);
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    // Set the secure cookie
    res.cookie('token', token, COOKIE_OPTIONS);

    sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    sendError(res, 'Login failed', 500);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    ...COOKIE_OPTIONS,
    maxAge: 0, // Expire immediately
  });
  sendSuccess(res, 'Logged out successfully', {});
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    const user = await User.findById(userId);
    
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, 'User fetched successfully', {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      address: user.address,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch user', 500);
  }
};
