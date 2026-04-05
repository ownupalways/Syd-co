import { Router, Response } from 'express';
import { AuditLog } from '@models/AuditLog';
import { sendSuccess, sendError } from '@utils/response';
import {
  adminProtect,
  superAdminOnly,
  AdminRequest,
} from '@middleware/adminAuth';

const router = Router();

router.get(
  '/',
  adminProtect,
  superAdminOnly,
  async (req: AdminRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 50, resource, adminId, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const query: Record<string, unknown> = {};
      if (resource) query['resource'] = resource;
      if (adminId) query['adminId'] = adminId;
      if (status) query['status'] = status;

      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        AuditLog.countDocuments(query),
      ]);

      sendSuccess(res, 'Audit logs fetched', {
        data: logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (_error) {
      sendError(res, 'Failed to fetch audit logs', 500);
    }
  },
);

// My own logs (sub-admin)
router.get(
  '/mine',
  adminProtect,
  async (req: AdminRequest, res: Response): Promise<void> => {
    try {
      const logs = await AuditLog.find({ adminId: req.adminId })
        .sort({ createdAt: -1 })
        .limit(100);
      sendSuccess(res, 'My logs fetched', logs);
    } catch (_error) {
      sendError(res, 'Failed to fetch logs', 500);
    }
  },
);

export default router;
