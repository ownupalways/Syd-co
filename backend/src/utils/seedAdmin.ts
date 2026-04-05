import mongoose from 'mongoose';
import { config } from '@config';
import { AdminUser } from '@models/AdminUser';
import { hashPassword } from '@utils/helpers';
import { logger } from '@utils/logger';

const seed = async (): Promise<void> => {
  await mongoose.connect(config.mongodb.uri);

  const existing = await AdminUser.findOne({ role: 'super-admin' });
  if (existing) {
    logger.info('Super admin already exists');
    process.exit(0);
  }

  const password = await hashPassword('SuperAdmin@123');
  await AdminUser.create({
    name: 'Super Admin',
    email: 'superadmin@sydneyshopping.com',
    password,
    role: 'super-admin',
    status: 'active',
    permissions: ['*'],
  });

  logger.info('✓ Super admin created');
  logger.info('Email: superadmin@sydneyshopping.com');
  logger.info('Password: SuperAdmin@123');
  await mongoose.disconnect();
  process.exit(0);
};

seed();
