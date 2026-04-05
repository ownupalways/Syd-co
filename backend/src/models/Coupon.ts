import { Schema, model, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: Date;
  createdBy: Schema.Types.ObjectId;
  createdByName: string;
  approvedBy?: Schema.Types.ObjectId;
  status: 'pending' | 'active' | 'rejected';
  createdAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, min: 0 },
    maxUses: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    createdByName: { type: String, required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon>('Coupon', couponSchema);
