import { Router } from 'express';
import { handleContactForm } from '@controllers/contactController';

const router = Router();

router.post('/', handleContactForm);

export default router;
