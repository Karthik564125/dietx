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

      <main className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-12 py-12 sm:py-20">
        <header className="space-y-4 text-center sm:text-left">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all group mx-auto sm:mx-0"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
              Book a <span className="text-emerald-600">Session</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Direct consultation with Dt. Madhavi Latha.</p>
          </div>
        </header>

        <div className="flex justify-center">
          {/* WhatsApp Card - Only one now */}
          <div className="glass-card p-12 sm:p-16 flex flex-col items-center text-center space-y-10 animate-float max-w-2xl w-full border-2 border-emerald-100/50">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-inner relative">
               <div className="absolute inset-0 bg-emerald-400/20 rounded-[2.5rem] animate-ping" style={{ animationDuration: '3s' }} />
               <MessageCircle size={44} className="relative z-10" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Instant WhatsApp <br /><span className="text-emerald-500">Booking</span></h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Connect directly with Dt. Madhavi Latha for quick questions or to schedule your personalized nutrition session immediately.
              </p>
            </div>

            <div className="w-full space-y-6">
                <a 
                  href="https://wa.me/919100101921?text=Hi%20I%20want%20to%20know%20more" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-4 py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" /> Start Chat Now
                </a>
                
                <div className="flex items-center justify-center gap-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Zap size={14} className="text-emerald-500" /> Fast Response</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <span>Direct Access</span>
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
