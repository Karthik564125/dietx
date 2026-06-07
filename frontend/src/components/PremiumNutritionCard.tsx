import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

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
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (user.isPremium) {
      setIsSuccess(true);
    }
  }, [user.isPremium]);

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

  return null;
};

export default PremiumNutritionCard;
