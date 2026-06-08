import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ArrowLeft, Activity, Target } from 'lucide-react';
import AestheticBackground from '../components/AestheticBackground';
import bgDashboard from '../assets/dashboard.jpg';
import { API_BASE_URL } from '../config';

interface HealthDetailProps {
  setIsAuthenticated: (val: boolean) => void;
}

const HealthDetail = ({ setIsAuthenticated }: HealthDetailProps) => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${API_BASE_URL}/api/health-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHealth(res.data.health))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-premium relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={bgDashboard} />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-12 py-12">
        <header className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/70 hover:text-white font-bold transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              Health <span className="text-emerald-400">Analytics</span>
            </h1>
            <p className="text-white/60 font-medium text-lg">Comprehensive view of your body metrics and trends.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BMI Focus Card */}
          <div className="md:col-span-2 glass-card p-10 space-y-8">
            <div className="flex justify-between items-start">
               <div>
                 <h3 className="text-sm font-black text-white/60 uppercase tracking-widest">Body Mass Index</h3>
                 <div className="flex items-baseline gap-4 mt-2">
                    <span className="text-7xl font-black text-white">{health?.bmi || '--'}</span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-500/20 text-emerald-300">{health?.bmiCategory}</span>
                 </div>
               </div>
               <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                 <Activity size={24} />
               </div>
            </div>

            <div className="space-y-6">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 via-emerald-400 to-red-400 transition-all duration-1000"
                  style={{ width: '100%' }}
                />
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-slate-900 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000"
                  style={{ left: `${Math.min(Math.max((health?.bmi||20)-15, 0)/30 * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>

             <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 sm:p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Current Weight</p>
                   <p className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">{health?.weight} <span className="text-xs sm:text-sm font-bold text-slate-400">kg</span></p>
                </div>
                <div className="p-4 sm:p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Height</p>
                   <p className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">{health?.height} <span className="text-xs sm:text-sm font-bold text-slate-400">cm</span></p>
                </div>
             </div>
          </div>

          {/* Goals Card */}
          <div className="glass-card p-10 bg-slate-900 text-white space-y-8">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Health Goals</h3>
              <Target className="text-emerald-400" size={24} />
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Weight Management', progress: 65 },
                { label: 'Metabolic Balance', progress: 40 },
                { label: 'Energy Levels', progress: 85 }
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{goal.label}</span>
                    <span className="text-emerald-400">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/onboarding', { state: { from: '/health' } })}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all mt-4 flex items-center justify-center gap-2 group"
            >
              Update Bio & Specs 
              <Target size={18} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>


      </main>
    </div>
  );
};

export default HealthDetail;
