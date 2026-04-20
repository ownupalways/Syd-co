import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@models/User';
import { sendSuccess, sendError } from '@utils/response';
import { config } from '@config';
import { AuthRequest } from '@types';

/**
 * Cookie Configuration
 * httpOnly: Prevents JS access (XSS protection)
 * sameSite: 'none' + secure: true is required for cross-domain sessions
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: (config.nodeEnv === 'production' ? 'none' : 'lax') as
    | 'none'
    | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  path: '/',
};

/**
 * Helper to generate signed JWT
 * Uses the standardized 'expiresIn' from your environment config
 */
const generateToken = (id: string, role: string, name: string): string => {
  const secret = config.jwt.secret;

  // No undefined allowed: The 'required' helper in config ensures this exists
  return jwt.sign({ id, role, name }, secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email and password are required', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 409);
    }

    // Mongoose middleware in User.ts handles password hashing automatically
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    const token = generateToken(user._id.toString(), user.role, user.name);

    res.cookie('token', token, COOKIE_OPTIONS);

    sendSuccess(
      res,
      'Registration successful',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      201,
    );
  } catch (error) {
    sendError(res, 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // select('+password') is required because it's hidden in the schema
    const user = await User.findOne({ email }).select('+password');

    // Using the instance method defined in src/models/User.ts
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated', 403);
    }

    const token = generateToken(user._id.toString(), user.role, user.name);

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
  // Options must match the 'set' call exactly to successfully clear
  res.clearCookie('token', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  sendSuccess(res, 'Logged out successfully', {});
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // req.userId is provided by the 'protect' middleware
    const user = await User.findById(req.userId);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, 'User fetched successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    sendError(res, 'Failed to fetch user', 500);
  }
};
