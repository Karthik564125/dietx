import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MessageCircle, ArrowLeft, Zap } from 'lucide-react';
import AestheticBackground from '../components/AestheticBackground';
import bgDashboard from '../assets/dashboard.jpeg';

interface SessionsProps {
  setIsAuthenticated: (val: boolean) => void;
}

const Sessions = ({ setIsAuthenticated }: SessionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-premium relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={bgDashboard} />

      <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-12 py-10 sm:py-16">

        <header className="space-y-6 text-center">
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-xl border border-white/50 rounded-full text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
              Direct <span className="text-emerald-400">Consultation</span>
            </h1>
            <p className="text-white/60 font-bold text-base sm:text-lg uppercase tracking-widest">Connect with Dt. Madhavi Latha</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          
          {/* Left: Branding & Info */}
          <div className="flex-1 space-y-6 text-center lg:text-left max-w-md">
             <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                   Personalized care, <br />
                   <span className="text-emerald-600">just a message away.</span>
                </h2>
                <p className="text-slate-500 font-bold text-base leading-relaxed">
                   Get your doubts cleared and plans customized in real-time through our dedicated WhatsApp support channel.
                </p>
             </div>
             
             <div className="flex flex-col gap-4">
                {[
                   "Science-backed Nutrition Plans",
                   "Weekly Progress Checks",
                   "Expert Recipe Suggestions",
                   "Direct WhatsApp Support"
                ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><Zap size={14} /></div>
                      <span className="font-bold text-slate-700">{item}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Right: Action Card */}
          <div className="flex-1 max-w-lg w-full">
            <div className="glass-card p-8 sm:p-12 flex flex-col items-center text-center space-y-8 border-4 border-white shadow-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-inner relative group">
                 <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-30" style={{ animationDuration: '3s' }} />
                 <MessageCircle size={36} className="relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="w-full space-y-6">
                  <a 
                    href="https://wa.me/919100101921?text=Hi%20I%20want%20to%20know%20more" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between group bg-emerald-600 text-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-lg sm:text-xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                  >
                    Start Chat Now <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all"><MessageCircle size={24} /></div>
                  </a>
                  
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                     Average response time: &lt; 2 hours
                  </p>
              </div>
            </div>
          </div>
        </div>


        {/* Info Section */}
        <section className="glass-card p-8 mt-8 text-center">
            <p className="text-white/70 font-medium leading-relaxed max-w-2xl mx-auto italic text-base">
                "Healing is a journey of small steps taken consistently every single day."
            </p>
            <p className="text-emerald-400 font-black mt-4 uppercase tracking-[0.3em] text-[11px]">DietX Holistic Wellness</p>
        </section>
      </main>
    </div>
  );
};

export default Sessions;
