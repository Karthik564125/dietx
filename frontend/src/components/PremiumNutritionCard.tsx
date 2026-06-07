import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PremiumNutritionCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isPremium?: boolean;
  };
}


declare global {
  interface Window {
    Razorpay: any;
  }
}

const PremiumNutritionCard: React.FC<PremiumNutritionCardProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (user.isPremium) {
      setIsSuccess(true);
    }
  }, [user.isPremium]);



  const handlePayment = async (amount: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // 1. Create Order in Backend with dynamic amount
      const { data } = await axios.post(
        'http://localhost:5001/api/payment/create-order',
        { amount },

        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = data;

      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_SnyXd605r6Yfse', // Test Key
        amount: order.amount,
        currency: order.currency,
        name: 'Diet X Premium',
        description: 'Personalized Dietician Consultation',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment in Backend
            const verifyRes = await axios.post(
              'http://localhost:5001/api/payment/verify',
              {
                ...response,
                userId: user.id,
                email: user.email,
                phone: user.phone || response.contact, // Use provided phone or checkout contact
                amount,
              },

              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setIsSuccess(true);
              toast.success('Payment Successful!');
            }
          } catch (err) {
            console.error(err);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#10b981', // Emerald 600
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed', error);
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) return (
    <div className="glass-card p-10 bg-emerald-50 border-emerald-200 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
        <CheckCircle2 className="text-white" size={40} />
      </div>
      <div className="space-y-2">
        <h4 className="text-2xl font-black text-slate-900">Payment Successful!</h4>
        <p className="text-emerald-800 font-bold text-lg">"Our dietician will contact you soon."</p>
        <p className="text-slate-500 text-sm">A confirmation has been sent to {user.email}</p>

      </div>
    </div>
  );
};

export default PremiumNutritionCard;
