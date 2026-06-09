import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Zap, Heart, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';
import AestheticBackground from '../components/AestheticBackground';
import bgLanding from '../assets/landingpage.jpg';

const LandingPage = () => {
   const navigate = useNavigate();

   const features = [
      { icon: <Zap size={13} />, title: "Personalized", desc: "Bio-individual", color: "text-amber-400" },
      { icon: <Leaf size={13} />, title: "Sustainable", desc: "Long-term goal", color: "text-emerald-400" },
      { icon: <Shield size={13} />, title: "Expert Care", desc: "Clinical focus", color: "text-blue-400" },
      { icon: <Heart size={13} />, title: "Holistic", desc: "Rejuvenation", color: "text-rose-400" },
   ];

   return (
      <div className="fixed inset-0 bg-premium overflow-hidden">

         <AestheticBackground bgImage={bgLanding} />

         {/* ── MOBILE LAYOUT (hidden on lg+) ── */}
         <div className="flex flex-col h-full lg:hidden relative z-10">

            {/* Nav */}
            <nav className="flex justify-between items-center px-5 py-3 shrink-0">
               <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center p-1.5 border border-white/30">
                     <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-lg font-black text-white tracking-tighter">DIET<span className="text-emerald-400">X</span></span>
               </div>
               <button
                  onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                  className="px-4 py-2 bg-white/15 backdrop-blur-xl text-white border border-white/30 rounded-full text-[10px] font-black uppercase tracking-widest"
               >
                  Sign In
               </button>
            </nav>

            {/* Hero content — centered in remaining space above features */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 pb-24 gap-4 text-center">

               {/* Logo mark */}
               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/25 rounded-[1.75rem] blur-[40px]" />
                  <div className="w-[4.5rem] h-[4.5rem] bg-white/15 backdrop-blur-3xl rounded-[1.75rem] border-2 border-white/25 shadow-2xl flex items-center justify-center relative z-10 p-2">
                     <img src={logo} alt="DietX" className="w-full h-full object-contain" />
                  </div>
               </div>

               {/* Badge */}
               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-xl text-emerald-300 border border-emerald-400/30 rounded-full text-[9px] font-black uppercase tracking-widest">
                  <Sparkles size={10} /> The Future of Holistic Health
               </div>

               {/* Headline */}
               <div className="-mt-1">
                  <h1 className="text-[2.4rem] font-black text-white tracking-tighter leading-[0.92]">
                     Heal your body,
                  </h1>
                  <h1 className="text-[2.4rem] font-black text-emerald-400 tracking-tighter leading-[0.92]">
                     the holistic way.
                  </h1>
               </div>

               {/* Subtext */}
               <p className="text-white/65 text-[11px] font-semibold leading-relaxed max-w-[280px]">
                  Science-backed nutrition by <span className="text-white font-black">Dt. Madhavi Latha</span> to transform your life sustainably.
               </p>

               {/* CTA */}
               <button
                  onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                  className="w-full max-w-[320px] flex items-center justify-between bg-emerald-500/85 backdrop-blur-xl text-white px-5 py-3.5 rounded-2xl font-black text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-900/40 border border-emerald-400/30"
               >
                  <span>Start Journey</span>
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                     <ArrowRight size={16} />
                  </div>
               </button>
            </div>

            {/* Features — absolutely locked to bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-3 border-t border-white/15 bg-black/10 backdrop-blur-sm">
               <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {features.map((f, i) => (
                     <div key={i} className="flex items-center gap-2">
                        <div className={`${f.color} opacity-90 shrink-0`}>{f.icon}</div>
                        <div>
                           <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none">{f.title}</p>
                           <p className="text-[8px] font-bold text-white/45 uppercase tracking-tight mt-0.5">{f.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* ── DESKTOP LAYOUT (hidden below lg) ── */}
         <div className="hidden lg:flex flex-col h-full relative z-10">

            {/* Nav */}
            <nav className="max-w-7xl mx-auto w-full px-8 py-4 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-white/30">
                     <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xl font-black text-white tracking-tighter">DIET<span className="text-emerald-400">X</span></span>
               </div>
               <button
                  onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                  className="px-6 py-2.5 bg-white/15 backdrop-blur-xl text-white border border-white/30 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:border-emerald-400 transition-all shadow-xl"
               >
                  Sign In
               </button>
            </nav>

            {/* Hero */}
            <div className="flex-1 min-h-0 flex items-center justify-center gap-16 px-8 max-w-7xl mx-auto w-full">

               {/* Text side */}
               <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-xl text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <Sparkles size={12} /> The Future of Holistic Health
                  </div>
                  <h1 className="text-5xl xl:text-8xl font-black text-white tracking-tighter leading-[0.92]">
                     Heal your body,<br />
                     <span className="text-emerald-400">the holistic way.</span>
                  </h1>
                  <p className="text-white/70 font-bold text-sm xl:text-xl leading-relaxed max-w-lg">
                     Experience a science-backed nutrition strategy designed by{' '}
                     <span className="text-white font-black">Dt. Madhavi Latha</span> to transform your life and vitality sustainably.
                  </p>
                  <button
                     onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                     className="flex items-center justify-between w-full max-w-sm group bg-emerald-500/80 backdrop-blur-xl text-white p-4 rounded-[2rem] text-lg font-black hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-emerald-900/30 border border-emerald-400/30"
                  >
                     <span>Start Journey</span>
                     <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all">
                        <ArrowRight size={20} />
                     </div>
                  </button>
               </div>

               {/* Logo side */}
               <div className="flex-1 flex justify-end">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-emerald-500/20 rounded-[3rem] blur-[60px] group-hover:bg-emerald-500/30 transition-all duration-700" />
                     <div className="w-[26rem] h-[26rem] xl:w-[32rem] xl:h-[32rem] bg-white/15 backdrop-blur-3xl rounded-[3.5rem] border-4 border-white/30 shadow-2xl flex items-center justify-center relative z-10 overflow-hidden p-6">
                        <img src={logo} alt="DietX" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer features */}
            <div className="max-w-7xl mx-auto w-full px-8 py-5 shrink-0">
               <div className="grid grid-cols-4 gap-10 pt-4 border-t border-white/15">
                  {features.map((f, i) => (
                     <div key={i} className="flex items-center gap-4 group">
                        <div className={`${f.color} opacity-80 transition-transform group-hover:scale-110 shrink-0`}>
                           {React.cloneElement(f.icon as React.ReactElement<any>, { size: 16 })}
                        </div>
                        <div>
                           <h3 className="text-[10px] font-black text-white uppercase tracking-widest">{f.title}</h3>
                           <p className="text-[8px] font-bold text-white/50 uppercase tracking-tighter mt-0.5">{f.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
   );
};

export default LandingPage;