import { Schema, model, Document } from 'mongoose';

export type ActionStatus = 'pending' | 'approved' | 'rejected';

export interface IPendingAction extends Document {
  adminId: Schema.Types.ObjectId;
  adminName: string;
  action: string;
  resource: string;
  resourceId?: string;
  payload: Record<string, unknown>;
  status: ActionStatus;
  reviewedBy?: Schema.Types.ObjectId;
  reviewedByName?: string;
  reviewNote?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

const pendingActionSchema = new Schema<IPendingAction>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    reviewedByName: { type: String },
    reviewNote: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const PendingAction = model<IPendingAction>('PendingAction', pendingActionSchema);
