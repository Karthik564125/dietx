import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Zap, Heart, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-premium flex flex-col relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto w-full px-6 py-4 sm:py-8 flex justify-between items-center shrink-0">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-white">
               <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">DIET<span className="text-emerald-600">X</span></span>
         </div>
         <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={() => navigate('/who-are-we')}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
            >
              Who Are We
            </button>
            <button 
              onClick={() => navigate('/auth', { state: { mode: 'login' } })}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
            >
              Sign In
            </button>
         </div>
      </nav>

      {/* Hero Section - Shifting Layout */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-8 lg:py-0 gap-12 lg:gap-20 max-w-7xl mx-auto w-full">
         
         {/* Visual Hook (Left on Laptop) */}
         <div className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative group">
               <div className="absolute inset-0 bg-emerald-500/10 rounded-[3rem] blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
               <div className="w-40 h-40 sm:w-64 sm:h-64 lg:w-[32rem] lg:h-[32rem] bg-white/40 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border-4 border-white shadow-2xl flex items-center justify-center relative z-10 overflow-hidden">
                  <img src={logo} alt="DietX" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
         </div>

         {/* Content (Right on Laptop) */}
         <div className="flex-1 text-center lg:text-left space-y-8 lg:space-y-12 order-2 lg:order-1">
            <div className="space-y-4 lg:space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 animate-bounce-subtle">
                  <Sparkles size={12} /> The Future of Holistic Health
               </div>
               <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] flex flex-col">
                  Heal your body,
                  <span className="text-emerald-600">the holistic way.</span>
               </h1>
               <p className="max-w-xl mx-auto lg:mx-0 text-slate-500 font-bold text-xs sm:text-lg lg:text-xl leading-relaxed opacity-80">
                  Experience a science-backed nutrition strategy designed by <span className="text-slate-900">Dt. Madhavi Latha</span> to transform your life and vitality sustainably.
               </p>
            </div>

            <div className="max-w-md mx-auto lg:mx-0 w-full">
               <button 
                  onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                  className="w-full flex items-center justify-between group bg-slate-900 text-white p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2.5rem] text-lg sm:text-xl font-black hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-slate-900/20"
               >
                  <span>Start Journey</span>
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all">
                     <ArrowRight size={22} className="sm:w-7 sm:h-7" />
                  </div>
               </button>
            </div>
         </div>
      </main>

      {/* Footer Features - More Compact for Laptop */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 lg:py-10 shrink-0">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 py-6 lg:py-8 border-t border-slate-200/50">
            {[
               { icon: <Zap />, title: "Personalized", desc: "Bio-individual", color: "text-amber-500" },
               { icon: <Leaf />, title: "Sustainable", desc: "Long-term goal", color: "text-emerald-500" },
               { icon: <Shield />, title: "Expert Care", desc: "Clinical focus", color: "text-blue-500" },
               { icon: <Heart />, title: "Holistic", desc: "Rejuvenation", color: "text-rose-500" }
            ].map((f, i) => (
               <div key={i} className="flex items-center gap-4 group">
                  <div className={`${f.color} opacity-80 transition-transform group-hover:scale-110`}>
                     {React.cloneElement(f.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <div>
                     <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{f.title}</h3>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{f.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </footer>

    </div>
  );
};

export default LandingPage;
