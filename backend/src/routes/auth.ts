import { Router, Response } from 'express';
import { register, login, getMe } from '@controllers/authController';
import { protect, AuthRequest } from '@middleware/authMiddleware';
import { sendSuccess, sendError } from '@utils/response';
import { User } from '@models/User';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Saves address to profile
router.put(
  '/address',
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { fullName, phone, address, city, state, zipCode, country } =
        req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          address: { fullName, phone, address, city, state, zipCode, country },
        },
        { new: true },
      );
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }
      sendSuccess(res, 'Address saved successfully', { address: user.address });
    } catch {
      sendError(res, 'Failed to save address', 500);
    }
  },
);

export default router;
