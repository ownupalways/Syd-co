import { Router, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '@models/Order';
import { Product } from '@models/Product';
import { protect, AuthRequest } from '@middleware/authMiddleware';
import { sendSuccess, sendError } from '@utils/response';
import { config } from '@config';

const router = Router();

const stripe = new (Stripe as unknown as new (
  key: string,
  config: object,
) => Stripe)(config.stripe.secretKey as string, {
  apiVersion: '2025-03-31.basil',
});

// Create payment intent
router.post('/payment-intent', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      sendError(res, 'No items provided', 400);
      return;
    }

    // Verify products and calculate total from DB
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        sendError(res, `Product ${item.productId} not found`, 404);
        return;
      }
      if (product.stock < item.quantity) {
        sendError(res, `Insufficient stock for ${product.name}`, 400);
        return;
      }
      total += product.price * item.quantity;
    }

    const shippingCost = total >= 50 ? 0 : 9.99;
    const finalTotal = Math.round((total + shippingCost) * 100) // cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalTotal,
      currency: 'usd',
      metadata: { userId: req.userId as string },
    });

    sendSuccess(res, 'Payment intent created', {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      total: total + shippingCost,
      subtotal: total,
      shippingCost,
    });
  } catch (_error) {
    sendError(res, 'Failed to create payment intent', 500);
  }
});

// Create order after payment
router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentIntentId, total, subtotal, shippingCost } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      sendError(res, 'Payment not completed', 400);
      return;
    }

    // Build order items from DB
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      // Reduce stock
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      status: 'processing',
      paymentStatus: 'paid',
      paymentIntentId,
      stripePaymentId: paymentIntent.id,
    });

    sendSuccess(res, 'Order placed successfully', {
      orderId: order._id,
      status: order.status,
      total: order.total,
    }, 201);
  } catch (_error) {
    sendError(res, 'Failed to create order', 500);
  }
});

// Get user orders
router.get('/my-orders', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price');

    sendSuccess(res, 'Orders fetched', orders);
  } catch (_error) {
    sendError(res, 'Failed to fetch orders', 500);
  }
});

// Get single order
router.get('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params['id'], user: req.userId });
    if (!order) { sendError(res, 'Order not found', 404); return; }
    sendSuccess(res, 'Order fetched', order);
  } catch (_error) {
    sendError(res, 'Failed to fetch order', 500);
  }
});

export default router;
