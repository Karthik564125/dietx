import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { MailService } from '../services/mailService';
import prisma from '../prismaClient';


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body; // In a real app, you'd validate this or use a fixed amount
    const receipt = `receipt_${Date.now()}`;
    
    const order = await PaymentService.createOrder(amount || 499, receipt);

    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Order creation failed' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      email,
      phone,
      amount 
    } = req.body;

    const isValid = PaymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Save to database
    const purchase = await (prisma as any).nutritionPlanPurchase.create({
      data: {
        userId,
        email,
        phone,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: Number(amount),
        status: 'completed',
      },
    });

    // Also update user's phone if it was provided
    if (phone && userId) {
      await (prisma as any).user.update({
        where: { id: userId },
        data: { phone },
      });
    }

    // Trigger Email Notification (Non-blocking or handled)
    try {
      const fullUser = await (prisma as any).user.findUnique({ where: { id: userId } });
      if (fullUser) {
        await MailService.sendConsultationMail({
          user: {
            id: fullUser.id,
            name: fullUser.name,
            email: fullUser.email,
            phone: fullUser.phone || phone || 'N/A',
            age: fullUser.age || 0,
            gender: fullUser.gender || 'N/A',
            height: fullUser.height || 0,
            weight: fullUser.weight || 0,
            activityLevel: fullUser.activityLevel || 'N/A',
            bmi: fullUser.bmi || 0,
            dailyCalories: fullUser.dailyCalories || 0
          },
          payment: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: Number(amount),
            date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          }
        });
      }
    } catch (mailError) {
      console.error('Failed to send consultation email:', mailError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and saved',
      purchase,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
};
