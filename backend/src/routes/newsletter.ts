import { Router, Request, Response } from 'express';
import { sendSuccess, sendError } from '@utils/response';
import { sendEmail, emailTemplates } from '@utils/emailService';
import { logger } from '@utils/logger';

// Simple in-memory store — replace with DB model later
const subscribers: { email: string; subscribedAt: Date }[] = [];

const router = Router();

router.post('/subscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) { sendError(res, 'Email is required', 400); return; }

    // Check if already subscribed
    const exists = subscribers.find((s) => s.email === email);
    if (exists) {
      sendError(res, 'This email is already subscribed', 409);
      return;
    }

    subscribers.push({ email, subscribedAt: new Date() });

    // Send confirmation email to subscriber
    await sendEmail({
      to: email,
      subject: '✨ Welcome to Syd & Co Newsletter!',
      html: emailTemplates.newsletterConfirm(email),
    });

    logger.info(`Newsletter subscriber added: ${email}`);
    sendSuccess(res, 'Successfully subscribed!', { email });
  } catch {
    sendError(res, 'Subscription failed', 500);
  }
});

router.get('/subscribers', async (_req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, 'Subscribers fetched', subscribers);
  } catch {
    sendError(res, 'Failed to fetch subscribers', 500);
  }
});

export { subscribers };
export default router;
