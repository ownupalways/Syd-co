import { Router } from 'express';
import { handleContactForm } from '@controllers/contactController';
import { contactLimiter } from '@middleware/rateLimiter'; // Adjust path as needed

const router = Router();

// The limiter runs BEFORE the controller
router.post('/', contactLimiter, handleContactForm);

export default router;
