import rateLimit from 'express-rate-limit';
import { config } from '@config';
import { sendError } from '@utils/response';

export const contactLimiter = rateLimit({
  // 1. Use the config object to clear the "never read" error
  windowMs: config.rateLimit.windowMs, 
  max: 5, // Keeping this strict (5) for the contact form specifically
  
  handler: (req, res) => {
    return sendError(
      res, 
      "You've reached the message limit. Please try again in an hour. 🛡️", 
      429
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});
