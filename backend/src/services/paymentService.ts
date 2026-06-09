import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class PaymentService {
  static async createOrder(amount: number, receipt: string, notes?: Record<string, string>) {
    const options: any = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt,
    };

    if (notes && Object.keys(notes).length > 0) {
      options.notes = notes;
    }

    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  static verifySignature(orderId: string, paymentId: string, signature: string) {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    return generated_signature === signature;
  }
}
