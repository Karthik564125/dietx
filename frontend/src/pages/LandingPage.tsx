import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Zap, Heart, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';
import AestheticBackground from '../components/AestheticBackground';
import bgLanding from '../assets/landingpage.jpg';

const LandingPage = () => {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-premium flex flex-col relative">

         <AestheticBackground bgImage={bgLanding} />

         {/* Navigation */}
         <nav className="relative z-50 max-w-7xl mx-auto w-full px-6 py-2 sm:py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-white/30">
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
               </div>
               <span className="text-xl font-black text-white tracking-tighter">DIET<span className="text-emerald-400">X</span></span>
            </div>
            <div className="flex items-center gap-4 sm:gap-8">
               <button
                  onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 bg-white/15 backdrop-blur-xl text-white border border-white/30 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:border-emerald-400 transition-all shadow-xl"
               >
                  Sign In
               </button>
            </div>
         </nav>

         {/* Hero Section */}
         <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-center px-6 py-0 lg:py-0 gap-3 lg:gap-18 max-w-7xl mx-auto w-full min-h-[50vh] sm:min-h-[55vh] lg:min-h-0">

            {/* Large logo — desktop only, optimized for standard laptop views */}
            <div className="hidden lg:flex flex-1 justify-end order-1 lg:order-2">
               <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-[3rem] blur-[60px] group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                  <div className="lg:w-[24rem] lg:h-[24rem] xl:w-[32rem] xl:h-[32rem] bg-white/15 backdrop-blur-3xl rounded-[3rem] xl:rounded-[4rem] border-4 border-white/30 shadow-2xl flex items-center justify-center relative z-10 overflow-hidden p-6">
                     <img src={logo} alt="DietX" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left space-y-1 sm:space-y-3 lg:space-y-6 xl:space-y-8 order-2 lg:order-1">

               {/* Logo — mobile only, prominent and resized to fit without scroll, set to object-contain */}
               <div className="flex justify-center lg:hidden">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-emerald-500/20 rounded-[2rem] blur-[50px] group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                              <div className="w-14 h-14 sm:w-24 sm:h-24 bg-white/15 backdrop-blur-3xl rounded-[2rem] border-2 border-white/30 shadow-2xl flex items-center justify-center relative z-10 overflow-hidden p-1">
                        <img src={logo} alt="DietX" className="w-full h-full object-contain" />
                     </div>
                  </div>
               </div>

               <div className="space-y-2 lg:space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-xl text-emerald-300 border border-emerald-400/30 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                     <Sparkles size={12} /> The Future of Holistic Health
                  </div>
                  <h1 className="text-2xl sm:text-2xl lg:text-5xl xl:text-8xl font-black text-white tracking-tighter leading-[0.95] flex flex-col">
                     Heal your body,
                     <span className="text-emerald-400">the holistic way.</span>
                  </h1>
                  <p className="max-w-xl mx-auto lg:mx-0 text-white/70 font-bold text-[7px] sm:text-[9px] lg:text-sm xl:text-xl leading-relaxed">
                     Experience a science-backed nutrition strategy designed by <span className="text-white font-black">Dt. Madhavi Latha</span> to transform your life and vitality sustainably.
                  </p>
               </div>

                  <div className="max-w-md mx-auto lg:mx-0 w-full -mb-8 lg:mb-0">
                  <button
                     onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                     className="w-full flex items-center justify-between group bg-emerald-500/80 backdrop-blur-xl text-white p-2 sm:p-2.5 xl:p-4 rounded-[1.25rem] sm:rounded-[2rem] xl:rounded-[2.5rem] text-sm sm:text-base xl:text-xl font-black hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-emerald-900/30 border border-emerald-400/30"
                  >
                     <span>Start Journey</span>
                     <div className="w-8 h-8 sm:w-10 sm:h-10 xl:w-14 xl:h-14 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all">
                        <ArrowRight size={16} className="sm:w-7 sm:h-7" />
                     </div>
                  </button>
               </div>
            </div>
         </main>

         {/* Footer Features */}
         <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-2 lg:py-10 shrink-0 -mt-8 lg:mt-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-10 py-1 lg:py-6 border-t border-white/15">
               {[
                  { icon: <Zap />, title: "Personalized", desc: "Bio-individual", color: "text-amber-400" },
                  { icon: <Leaf />, title: "Sustainable", desc: "Long-term goal", color: "text-emerald-400" },
                  { icon: <Shield />, title: "Expert Care", desc: "Clinical focus", color: "text-blue-400" },
                  { icon: <Heart />, title: "Holistic", desc: "Rejuvenation", color: "text-rose-400" }
               ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-4 group">
                     <div className={`${f.color} opacity-80 transition-transform group-hover:scale-110 shrink-0`}>
                        {React.cloneElement(f.icon as React.ReactElement<any>, { size: 16 })}
                     </div>
                     <div>
                        <h3 className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest">{f.title}</h3>
                        <p className="text-[7px] sm:text-[8px] font-bold text-white/50 uppercase tracking-tighter mt-0.5">{f.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </footer>

      </div>
   );
};

export default LandingPage;
