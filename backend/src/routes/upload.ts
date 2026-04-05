import { Router, Request, Response } from 'express';
import { upload } from '@middleware/upload';
import { uploadToCloudinary } from '@utils/uploadToCloudinary';
import { adminProtect } from '@middleware/adminAuth';
import { sendSuccess, sendError } from '@utils/response';

const router = Router();

router.post(
  '/image',
  adminProtect,
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        sendError(res, 'No image file provided', 400);
        return;
      }
      const result = await uploadToCloudinary(
        req.file.buffer,
        'sydney-shopping/products',
      );
      sendSuccess(res, 'Image uploaded successfully', {
        url: result.url,
        publicId: result.publicId,
      });
    } catch (_error) {
      sendError(res, 'Image upload failed', 500);
    }
  },
);

router.post(
  '/images',
  adminProtect,
  upload.array('images', 5),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        sendError(res, 'No image files provided', 400);
        return;
      }
      const uploads = await Promise.all(
        files.map((file) =>
          uploadToCloudinary(file.buffer, 'sydney-shopping/products'),
        ),
      );
      sendSuccess(res, 'Images uploaded successfully', {
        images: uploads.map((u) => ({
          url: u.url,
          publicId: u.publicId,
        })),
      });
    } catch (_error) {
      sendError(res, 'Images upload failed', 500);
    }
  },
);

export default router;
