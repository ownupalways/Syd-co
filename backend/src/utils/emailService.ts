import nodemailer from 'nodemailer';
import { config } from '@config'; // Ensure this alias matches your tsconfig
import { logger } from '@utils/logger';

// 1. Configure the transporter using the config object
const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: Number(config.email.smtpPort),
  secure: config.email.smtpPort === 465, // Use secure for 465, false for 587
  auth: {
    user: config.email.smtpUser,
    pass: config.email.smtpPassword,
  },
});

interface EmailOptions {
  to: string | undefined;
  subject: string;
  html: string;
  replyTo?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!options.to) {
    logger.error('Email send failed: No recipient provided.');
    return;
  }

  try {
    await transporter.sendMail({
      // 2. Use config for the 'from' field as well
      from: `"${config.email.fromName || 'Sydney Shopping'}" <${config.email.smtpUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Email send failed:', error);
  }
};
