import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

/**
 * Helper to ensure required environment variables are present.
 * If the key is missing in .env, the app throws an error immediately.
 */
const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Config Error: Environment variable ${key} is missing.`);
  }
  return value;
};

export const config = {
  // Server & App Info
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  logLevel: process.env.LOG_LEVEL || 'info',
  app: {
    name: process.env.APP_NAME || 'Sydney Shopping',
    version: process.env.APP_VERSION || '1.0.0',
  },

  // Database
  mongodb: {
    // Using required() here ensures we don't try to connect to an empty string
    uri: required('MONGODB_URI'),
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
  },

  // JWT
  jwt: {
    secret: required('JWT_SECRET'), // Use required() here for security
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      '7d') as `${number}${'s' | 'm' | 'h' | 'd'}`,
  },

  // CORS
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
    credentials: true,
  },

  // Email
  email: {
    smtpHost: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    fromName: process.env.SMTP_FROM_NAME || 'Sydney Shopping',
    superAdminEmail:
      process.env.SUPER_ADMIN_EMAIL || 'superadmin@sydneyshopping.com',
  },

  // Cloudinary
  cloudinary: {
    cloudName: required('CLOUDINARY_CLOUD_NAME'),
    apiKey: required('CLOUDINARY_API_KEY'),
    apiSecret: required('CLOUDINARY_API_SECRET'),
  },

  // Stripe
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_MINUTES || '15', 10) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_REQUESTS || '100', 10),
  },

  // Helpers for logic throughout the app
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

export default config;
