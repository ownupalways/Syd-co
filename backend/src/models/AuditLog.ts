import { Schema, model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: Schema.Types.ObjectId;
  adminName: string;
  adminRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, unknown>;
  status: 'success' | 'pending' | 'rejected' | 'failed';
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    adminName: { type: String, required: true },
    adminRole: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['success', 'pending', 'rejected', 'failed'],
      default: 'success',
    },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
