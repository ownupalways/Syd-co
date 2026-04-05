import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '@controllers/productController';
import { adminProtect } from '@middleware/adminAuth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', adminProtect, createProduct);
router.put('/:id', adminProtect, updateProduct);
router.delete('/:id', adminProtect, deleteProduct);

export default router;
