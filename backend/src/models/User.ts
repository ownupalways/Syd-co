import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  address?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
  type: {
    fullName: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
  },
  default: undefined,
},
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>('User', userSchema);
