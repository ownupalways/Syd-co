import mongoose, { ConnectOptions } from 'mongoose';
import { config } from './environment';
import { logger } from '@utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options: ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    if (config.mongodb.username && config.mongodb.password) {
      options.authSource = 'admin';
    }

    await mongoose.connect(config.mongodb.uri, options);

    logger.info(`✓ MongoDB connected successfully to ${config.mongodb.uri}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('✓ MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Failed to disconnect from MongoDB:', error);
  }
};
