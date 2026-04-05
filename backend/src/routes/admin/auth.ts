import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminUser } from '@models/AdminUser';
import { hashPassword, comparePassword } from '@utils/helpers';
import { sendSuccess, sendError } from '@utils/response';
import { logAction } from '@utils/auditLogger';
import { notifySuperAdmins } from '@utils/socketManager';
import { adminProtect, superAdminOnly, AdminRequest } from '@middleware/adminAuth';
import { config } from '@config';

const router = Router();

const generateAdminToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, config.jwt.secret as string, { expiresIn: '8h' });

// Register sub-admin
router.post('/register', async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      sendError(res, 'Name, email and password are required', 400);
      return;
    }

    if (password.length < 8) {
      sendError(res, 'Password must be at least 8 characters', 400);
      return;
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      sendError(res, 'Email already registered', 409);
      return;
    }

    const hashedPassword = await hashPassword(password);
    const admin = await AdminUser.create({
      name, email,
      password: hashedPassword,
      phone,
      role: 'sub-admin',
      status: 'pending',
    });

    // Notify super admins in real-time
    notifySuperAdmins('new-registration', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    });

    sendSuccess(res, 'Registration submitted. Awaiting super-admin approval.', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      status: admin.status,
    }, 201);
  } catch (_error) {
    sendError(res, 'Registration failed', 500);
  }
});

// Login
router.post('/login', async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'Email and password required', 400);
      return;
    }

    const admin = await AdminUser.findOne({ email }).select('+password');
    if (!admin) { sendError(res, 'Invalid credentials', 401); return; }

    // Check lock
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      sendError(res, 'Account locked. Try again later.', 423);
      return;
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      // Increment login attempts
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lock
        await admin.save();
        sendError(res, 'Too many failed attempts. Account locked for 30 minutes.', 423);
      } else {
        await admin.save();
        sendError(res, `Invalid credentials. ${5 - admin.loginAttempts} attempts remaining.`, 401);
      }
      return;
    }

    if (admin.status === 'pending') {
      sendError(res, 'Your account is awaiting approval', 403);
      return;
    }
    if (admin.status === 'rejected') {
      sendError(res, `Account rejected: ${admin.rejectionReason || 'Contact super admin'}`, 403);
      return;
    }
    if (admin.status === 'suspended') {
      sendError(res, 'Account suspended. Contact super admin.', 403);
      return;
    }

    // Reset attempts on success
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateAdminToken(String(admin._id), admin.role);

    await logAction(
      { ...req, adminId: String(admin._id), adminName: admin.name, adminRole: admin.role } as AdminRequest,
      'LOGIN', 'AdminUser', { email: admin.email }, String(admin._id), 'success'
    );

    sendSuccess(res, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (_error) {
    sendError(res, 'Login failed', 500);
  }
});

// Get current admin profile
router.get('/me', adminProtect, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const admin = await AdminUser.findById(req.adminId);
    if (!admin) { sendError(res, 'Admin not found', 404); return; }
    sendSuccess(res, 'Profile fetched', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin,
    });
  } catch (_error) {
    sendError(res, 'Failed to fetch profile', 500);
  }
});

// Get all sub-admins (super-admin only)
router.get('/sub-admins', adminProtect, superAdminOnly, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: Record<string, unknown> = { role: 'sub-admin' };
    if (status) query['status'] = status;

    const admins = await AdminUser.find(query).sort({ createdAt: -1 });
    sendSuccess(res, 'Sub-admins fetched', admins.map((a) => ({
      id: a._id,
      name: a.name,
      email: a.email,
      status: a.status,
      permissions: a.permissions,
      lastLogin: a.lastLogin,
      createdAt: a.createdAt,
    })));
  } catch (_error) {
    sendError(res, 'Failed to fetch sub-admins', 500);
  }
});

// Approve or reject sub-admin
router.put('/sub-admins/:id/review', adminProtect, superAdminOnly, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { action, reason, permissions } = req.body;
    const admin = await AdminUser.findById(req.params['id']);

    if (!admin || admin.role !== 'sub-admin') {
      sendError(res, 'Sub-admin not found', 404);
      return;
    }

    if (action === 'approve') {
      admin.status = 'active';
      admin.permissions = permissions || admin.permissions;
      admin.createdBy = req.adminId as unknown as typeof admin.createdBy;
    } else if (action === 'reject') {
      admin.status = 'rejected';
      admin.rejectionReason = reason;
    } else if (action === 'suspend') {
      admin.status = 'suspended';
      admin.rejectionReason = reason;
    }

    await admin.save();

    await logAction(req, `ADMIN_${action.toUpperCase()}`, 'AdminUser',
      { targetAdmin: admin.name, reason }, String(admin._id));

    // Notify the sub-admin
    notifySuperAdmins('admin-reviewed', {
      id: admin._id,
      name: admin.name,
      status: admin.status,
    });

    sendSuccess(res, `Sub-admin ${action}d successfully`, { id: admin._id, status: admin.status });
  } catch (_error) {
    sendError(res, 'Review failed', 500);
  }
});

export default router;
