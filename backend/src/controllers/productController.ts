import { Request, Response } from 'express';
import { Product } from '@models/Product';
import { sendSuccess, sendError, sendPaginatedResponse } from '@utils/response';
import { AuthRequest } from '@types'; // Using the global strict type
import { logAction, createPendingAction } from '@utils/auditLogger';
import { notifySuperAdmins } from '@utils/socketManager';

export const createProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      images,
      stock,
      seller,
      isBestSeller,
    } = req.body;

    if (!name || !description || !price || !category || !image || !seller) {
      return sendError(res, 'Missing required fields', 400);
    }

    const payload = {
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      image,
      images: images || [],
      stock: Number(stock) || 0,
      seller,
      isBestSeller: isBestSeller || false,
    };

    // Sub-admin actions go to pending queue
    if (req.adminRole === 'sub-admin') {
      const pendingId = await createPendingAction(
        req,
        'CREATE_PRODUCT',
        'Product',
        payload,
      );

      notifySuperAdmins('pending-action', {
        adminName: req.adminName || 'Unknown Admin',
        action: 'CREATE_PRODUCT',
        resource: 'Product',
        pendingId,
      });

      return sendSuccess(
        res,
        'Product creation submitted for approval',
        { pendingId },
        202,
      );
    }

    // Super admin — execute immediately
    const product = await Product.create(payload);
    await logAction(
      req,
      'CREATE_PRODUCT',
      'Product',
      payload,
      String(product._id),
    );

    sendSuccess(res, 'Product created successfully', product, 201);
  } catch (_error) {
    sendError(res, 'Failed to create product', 500);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.adminRole === 'sub-admin') {
      const pendingId = await createPendingAction(
        req,
        'UPDATE_PRODUCT',
        'Product',
        req.body,
        id,
      );

      notifySuperAdmins('pending-action', {
        adminName: req.adminName || 'Unknown Admin',
        action: 'UPDATE_PRODUCT',
        resource: 'Product',
        pendingId,
      });

      return sendSuccess(
        res,
        'Product update submitted for approval',
        { pendingId },
        202,
      );
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    await logAction(req, 'UPDATE_PRODUCT', 'Product', req.body, id);
    sendSuccess(res, 'Product updated successfully', product);
  } catch (_error) {
    sendError(res, 'Failed to update product', 500);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.adminRole === 'sub-admin') {
      const pendingId = await createPendingAction(
        req,
        'DELETE_PRODUCT',
        'Product',
        { productId: id },
        id,
      );

      notifySuperAdmins('pending-action', {
        adminName: req.adminName || 'Unknown Admin',
        action: 'DELETE_PRODUCT',
        resource: 'Product',
        pendingId,
      });

      return sendSuccess(
        res,
        'Product deletion submitted for approval',
        { pendingId },
        202,
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    await logAction(
      req,
      'DELETE_PRODUCT',
      'Product',
      { name: product.name },
      id,
    );
    sendSuccess(res, 'Product deleted successfully');
  } catch (_error) {
    sendError(res, 'Failed to delete product', 500);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 12;
    const category = req.query['category'] as string;
    const search = req.query['search'] as string;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isActive: true };
    if (category) query['category'] = category;
    if (search) query['name'] = { $regex: search, $options: 'i' };

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    sendPaginatedResponse(
      res,
      products,
      page,
      limit,
      total,
      'Products fetched successfully',
    );
  } catch (_error) {
    sendError(res, 'Failed to fetch products', 500);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product || !product.isActive) {
      sendError(res, 'Product not found', 404);
      return;
    }
    sendSuccess(res, 'Product fetched successfully', product);
  } catch (_error) {
    sendError(res, 'Failed to fetch product', 500);
  }
};
