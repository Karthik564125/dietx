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



  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Create Order in Backend
      const { data } = await axios.post(
        'http://localhost:5001/api/payment/create-order',
        { amount: 499 },

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
                amount: 499,
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

  if (isSuccess) {
    return (
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
  }

  return (
    <div className="glass-card p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-transparent relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700" />
      
      <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="text-white" size={28} />
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            Premium Access
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-3xl font-black tracking-tight">Unlock Personal Nutrition Plan</h4>
          <p className="text-slate-400 font-medium text-base leading-relaxed">
            Get a tailored 4-week meal plan, 1-on-1 expert consultation, and daily habit tracking with our senior dieticians.
          </p>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">₹499</span>

            <span className="text-slate-400 font-bold line-through text-lg">₹999</span>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Unlock Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumNutritionCard;
