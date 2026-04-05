import { Schema, model, Document } from 'mongoose';

export type AdminRole = 'super-admin' | 'sub-admin';
export type AdminStatus = 'pending' | 'active' | 'rejected' | 'suspended';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  status: AdminStatus;
  avatar?: string;
  phone?: string;
  permissions: string[];
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdBy?: Schema.Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String, required: true,
      unique: true, lowercase: true, trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ['super-admin', 'sub-admin'],
      default: 'sub-admin',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'suspended'],
      default: 'pending',
    },
    avatar: { type: String },
    phone: { type: String, trim: true },
    permissions: {
      type: [String],
      default: [
        'products:read',
        'orders:read',
        'users:read',
        'reports:read',
      ],
    },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export const AdminUser = model<IAdminUser>('AdminUser', adminUserSchema);
