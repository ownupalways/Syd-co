import { AuditLog } from '@models/AuditLog';
import { PendingAction } from '@models/PendingAction';
import { AdminRequest } from '@middleware/adminAuth';

export const logAction = async (
  req: AdminRequest,
  action: string,
  resource: string,
  details: Record<string, unknown> = {},
  resourceId?: string,
  status: 'success' | 'pending' | 'failed' = 'success'
): Promise<void> => {
  try {
    await AuditLog.create({
      adminId: req.adminId,
      adminName: req.adminName,
      adminRole: req.adminRole,
      action,
      resource,
      resourceId,
      details,
      status,
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || '',
    });
  } catch (_error) {
    // Non-blocking — don't fail the request if audit log fails
  }
};

export const createPendingAction = async (
  req: AdminRequest,
  action: string,
  resource: string,
  payload: Record<string, unknown>,
  resourceId?: string
): Promise<string> => {
  const pending = await PendingAction.create({
    adminId: req.adminId,
    adminName: req.adminName,
    action,
    resource,
    resourceId,
    payload,
    status: 'pending',
  });

  // Also log it as pending in audit log
  await logAction(req, action, resource, payload, resourceId, 'pending');

  return String(pending._id);
};
