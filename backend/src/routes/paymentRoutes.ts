import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/payment/create-order', authMiddleware, createOrder);
router.post('/payment/verify', authMiddleware, verifyPayment);

export default router;
