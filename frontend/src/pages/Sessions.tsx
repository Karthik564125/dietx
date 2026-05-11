import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MessageCircle, ArrowLeft, Zap } from 'lucide-react';

interface SessionsProps {
  setIsAuthenticated: (val: boolean) => void;
}

const Sessions = ({ setIsAuthenticated }: SessionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-premium">
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-16 py-12 sm:py-24">

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
            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
              Direct <span className="text-emerald-600">Consultation</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg sm:text-xl uppercase tracking-widest">Connect with Dt. Madhavi Latha</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          
          {/* Left: Branding & Info */}
          <div className="flex-1 space-y-8 text-center lg:text-left max-w-md">
             <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                   Personalized care, <br />
                   <span className="text-emerald-600">just a message away.</span>
                </h2>
                <p className="text-slate-500 font-bold text-lg leading-relaxed">
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
          <div className="flex-1 max-w-xl w-full">
            <div className="glass-card p-10 sm:p-16 flex flex-col items-center text-center space-y-10 border-4 border-white shadow-2xl">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-emerald-50 text-emerald-600 rounded-[2.5rem] sm:rounded-[3.5rem] flex items-center justify-center shadow-inner relative group">
                 <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-30" style={{ animationDuration: '3s' }} />
                 <MessageCircle size={44} className="relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="w-full space-y-8">
                  <a 
                    href="https://wa.me/919100101921?text=Hi%20I%20want%20to%20know%20more" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between group bg-emerald-600 text-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] text-xl sm:text-2xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                  >
                    Start Chat Now <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all"><MessageCircle size={28} /></div>
                  </a>
                  
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                     Average response time: &lt; 2 hours
                  </p>
              </div>
            </div>
          </div>
        </div>


        {/* Info Section */}
        <section className="glass-card p-10 mt-12 text-center border-emerald-50/50">
            <p className="text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic text-lg">
                "Healing is a journey of small steps taken consistently every single day."
            </p>
            <p className="text-emerald-600 font-black mt-4 uppercase tracking-[0.3em] text-[11px]">DietX Holistic Wellness</p>
        </section>
      </main>
    </div>
  );
};

export default Sessions;
