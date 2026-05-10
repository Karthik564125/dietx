import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Zap } from 'lucide-react';

import logo from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen h-[100dvh] bg-premium overflow-hidden flex flex-col p-4 sm:p-6">
      
      {/* Main Brand & Action Area */}
      <main className="flex-grow flex flex-col items-center justify-center gap-6 lg:gap-14 animate-float">
        
        {/* Massive Floating Logo & Brand Identity */}
        <div className="flex flex-col items-center gap-8 lg:gap-12">
          <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] flex items-center justify-center relative group transition-transform duration-700 hover:scale-105">
            <img 
              src={logo} 
              alt="DietX Logo" 
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h1 className="text-7xl sm:text-9xl lg:text-[14rem] font-black text-slate-900 tracking-tighter leading-none">
              DIET<span className="text-emerald-600">X</span>
            </h1>
            <p className="text-sm sm:text-2xl lg:text-3xl font-black text-slate-400 uppercase tracking-[0.6em] mt-2 lg:mt-6">
              Holistic Wellness
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-6 w-full max-w-sm shrink-0">
          <button 
            onClick={() => navigate('/auth', { state: { mode: 'signup' } })} 
            className="w-full btn-primary text-xl sm:text-3xl px-12 py-6 sm:py-8 rounded-2xl sm:rounded-[40px] shadow-2xl transform transition-all active:scale-95"
          >
            Get Started <ArrowRight size={32} />
          </button>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Returning Member?</span>
            <button 
              onClick={() => navigate('/auth', { state: { mode: 'login' } })} 
              className="text-base text-slate-900 font-bold hover:text-emerald-600 transition-colors"
            >
              Already have an account? <span className="underline decoration-2 underline-offset-4 decoration-emerald-500/30">Sign In</span>
            </button>
          </div>
        </div>
      </main>

      {/* Feature Icons - Minimalized */}
      <div className="mt-auto flex justify-center gap-6 lg:gap-12 max-w-5xl mx-auto pb-4 lg:pb-12 shrink-0">
        {[
          { icon: <Zap />, title: "Personalized", color: "text-amber-600" },
          { icon: <Leaf />, title: "Sustainable", color: "text-emerald-600" },
          { icon: <Shield />, title: "Expert Care", color: "text-blue-600" },
          { icon: <Zap />, title: "Holistic", color: "text-violet-600" }
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 lg:w-14 lg:h-14 ${feature.color} flex items-center justify-center`}>
              {feature.icon ? React.cloneElement(feature.icon as React.ReactElement<any>, { size: 24 }) : null}
            </div>
            <h3 className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest">{feature.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
