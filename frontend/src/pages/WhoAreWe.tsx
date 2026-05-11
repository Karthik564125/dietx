import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Eye, Users, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const WhoAreWe = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen h-[100dvh] bg-premium overflow-hidden flex flex-col p-4 sm:p-6">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 flex justify-start pt-4 lg:pt-8 relative z-50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 max-w-7xl mx-auto w-full px-6 lg:px-12">
        
        {/* Left: Branding & Visual (Similar to Landing) */}
        <div className="flex-1 flex flex-col items-center lg:items-start gap-4 sm:gap-8">
          <div className="w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 flex items-center justify-center relative group transition-transform duration-700 hover:scale-105">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[40px] sm:blur-[60px] rounded-full"></div>
            <img 
              src={logo} 
              alt="DietX Logo" 
              className="w-full h-full object-contain relative z-10"
            />
          </div>
          
          <div className="text-center lg:text-left space-y-1">
            <h1 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-[0.85] flex flex-col">
              WHO ARE <span className="text-emerald-600">WE?</span>
            </h1>
            <p className="text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-[0.4em] mt-4">
              Dedicated <span className="text-slate-900">Health</span> Professionals
            </p>
          </div>
        </div>

        {/* Right: Mission & Vision */}
        <div className="flex-1 flex flex-col items-center lg:items-start gap-8 lg:gap-12 lg:pl-12 border-t lg:border-t-0 lg:border-l border-slate-200/50 pt-8 lg:pt-0 lg:py-12">
           <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                 <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                    Our <span className="text-emerald-600">Mission</span>
                 </h2>
                 <p className="text-slate-500 font-bold text-[10px] sm:text-base max-w-md leading-relaxed">
                    To empower individuals with science-backed, holistic nutrition that heals from within and transforms lifestyles sustainably.
                 </p>
              </div>

              <div className="space-y-2">
                 <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                    Our <span className="text-emerald-600">Vision</span>
                 </h2>
                 <p className="text-slate-500 font-bold text-[10px] sm:text-base max-w-md leading-relaxed">
                    Setting the global standard for personalized holistic wellness, where every meal is a step toward rejuvenation and vitality.
                 </p>
              </div>
           </div>

           <div className="w-full max-w-md">
              <button 
                onClick={() => navigate('/auth')} 
                className="w-full flex items-center justify-between group bg-slate-900 text-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] text-sm sm:text-xl font-black hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-slate-900/20"
              >
                Join Our Journey <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all"><ArrowRight size={20} /></div>
              </button>
           </div>
        </div>

      </main>

      {/* Feature Icons - Matching Landing */}
      <div className="mt-auto flex justify-center gap-6 lg:gap-12 max-w-5xl mx-auto pb-8 lg:pb-16 shrink-0">
        {[
          { icon: <Target />, title: "Accuracy", color: "text-amber-600" },
          { icon: <Heart />, title: "Empathy", color: "text-rose-600" },
          { icon: <Eye />, title: "Precision", color: "text-blue-600" },
          { icon: <Users />, title: "Expertise", color: "text-violet-600" }
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 lg:w-14 lg:h-14 ${feature.color} flex items-center justify-center`}>
              {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 24 })}
            </div>
            <h3 className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest">{feature.title}</h3>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WhoAreWe;
