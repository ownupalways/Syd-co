import { Router, Response } from 'express';
import { PendingAction } from '@models/PendingAction';
import { AuditLog } from '@models/AuditLog';
import { Product } from '@models/Product';
import { sendSuccess, sendError } from '@utils/response';
import { logAction } from '@utils/auditLogger';
import { notifyAdmin } from '@utils/socketManager';
import { adminProtect, superAdminOnly, AdminRequest } from '@middleware/adminAuth';

const router = Router();

// Get all pending actions (super-admin)
router.get('/', adminProtect, superAdminOnly, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [actions, total] = await Promise.all([
      PendingAction.find({ status })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      PendingAction.countDocuments({ status }),
    ]);

    sendSuccess(res, 'Pending actions fetched', {
      data: actions,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (_error) {
    sendError(res, 'Failed to fetch pending actions', 500);
  }
});

// Get my pending actions (sub-admin)
router.get('/mine', adminProtect, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const actions = await PendingAction.find({ adminId: req.adminId }).sort({ createdAt: -1 });
    sendSuccess(res, 'My actions fetched', actions);
  } catch (_error) {
    sendError(res, 'Failed to fetch actions', 500);
  }
});

// Review a pending action
router.put('/:id/review', adminProtect, superAdminOnly, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { action, note } = req.body;
    const pending = await PendingAction.findById(req.params['id']);

    if (!pending || pending.status !== 'pending') {
      sendError(res, 'Pending action not found or already reviewed', 404);
      return;
    }

    pending.status = action === 'approve' ? 'approved' : 'rejected';
    pending.reviewedBy = req.adminId as unknown as typeof pending.reviewedBy;
    pending.reviewedByName = req.adminName;
    pending.reviewNote = note;
    pending.reviewedAt = new Date();
    await pending.save();

    // Execute the action if approved
    if (action === 'approve') {
      await executeApprovedAction(pending.action, pending.resource, pending.resourceId, pending.payload);
    }

    // Update audit log status
    await AuditLog.findOneAndUpdate(
      { adminId: pending.adminId, resource: pending.resource, status: 'pending' },
      { status: action === 'approve' ? 'success' : 'rejected' }
    );

    // Notify the sub-admin
    notifyAdmin(String(pending.adminId), 'action-reviewed', {
      action: pending.action,
      resource: pending.resource,
      status: pending.status,
      note,
      reviewedBy: req.adminName,
    });

    await logAction(req, `REVIEW_${action.toUpperCase()}`, pending.resource,
      { targetAction: pending.action, note }, pending.resourceId);

    sendSuccess(res, `Action ${action}d successfully`);
  } catch (_error) {
    sendError(res, 'Review failed', 500);
  }
});

const executeApprovedAction = async (
  action: string,
  resource: string,
  resourceId: string | undefined,
  payload: Record<string, unknown>
): Promise<void> => {
  if (resource === 'Product') {
    if (action === 'CREATE_PRODUCT') await Product.create(payload);
    if (action === 'UPDATE_PRODUCT' && resourceId) await Product.findByIdAndUpdate(resourceId, payload);
    if (action === 'DELETE_PRODUCT' && resourceId) await Product.findByIdAndUpdate(resourceId, { isActive: false });
  }
};

export default router;
