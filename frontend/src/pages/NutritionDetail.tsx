import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ArrowLeft, Salad, Flame, PieChart, Info, ChevronRight } from 'lucide-react';

interface NutritionDetailProps {
  setIsAuthenticated: (val: boolean) => void;
}

const NutritionDetail = ({ setIsAuthenticated }: NutritionDetailProps) => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:5001/api/health-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHealth(res.data.health))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-premium">
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-12 py-12">
        <header className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
              Nutrition <span className="text-emerald-600">Strategy</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Your personalized fuel guide based on your {health?.bmiCategory} profile.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Calorie Card */}
           <div className="glass-card p-10 bg-emerald-600 text-white flex flex-col justify-between space-y-8">
              <div>
                <Flame size={32} className="mb-6 opacity-80" />
                <h3 className="text-sm font-black text-emerald-100 uppercase tracking-widest">Recommended Daily Intake</h3>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-6xl font-black">{health?.dailyCalories || '2000'}</span>
                  <span className="text-lg font-bold opacity-80">kcal</span>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90 border-t border-white/20 pt-6">
                Calculated using the Mifflin-St Jeor equation, optimized for your {health?.activityLevel?.replace(/([A-Z])/g, ' $1').toLowerCase()} lifestyle.
              </p>
           </div>

           {/* Macro Split Card */}
           <div className="md:col-span-2 glass-card p-10 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Macro-Nutrient Split</h3>
                <PieChart className="text-emerald-600" size={24} />
              </div>

              <div className="grid grid-cols-3 gap-8">
                 {[
                   { label: 'Protien', value: '30%', color: 'bg-emerald-500', desc: 'Repairs and builds tissue' },
                   { label: 'Carbs', value: '45%', color: 'bg-blue-500', desc: 'Main energy source' },
                   { label: 'Fats', value: '25%', color: 'bg-amber-500', desc: 'Hormonal & cell health' }
                 ].map((macro, i) => (
                   <div key={i} className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">{macro.value}</span>
                        <div className={`w-3 h-3 rounded-full ${macro.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{macro.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{macro.desc}</p>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${macro.color} rounded-full`} style={{ width: macro.value }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Nutrition Tips Section */}
        <section className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Salad className="text-emerald-600" size={32} />
              Curated Meal Architecture
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { time: 'Breakfast', title: 'The Ignition Meal', icon: '🌅', desc: 'High protein and complex carbs to fire up your metabolism.' },
                    { time: 'Lunch', title: 'The Power Fuel', icon: '☀️', desc: 'Balanced greens, healthy fats and lean protein for steady energy.' },
                    { time: 'Dinner', title: 'The Recovery Meal', icon: '🌙', desc: 'Light and mineral-rich food to aid overnight healing.' }
                ].map((meal, i) => (
                    <div key={i} className="glass-card p-8 group cursor-pointer border-transparent hover:border-emerald-100">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-4xl">{meal.icon}</span>
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{meal.time}</div>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">{meal.title}</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">{meal.desc}</p>
                        <button className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-all">
                            View Suggested Recipes <ChevronRight size={14} />
                        </button>
                    </div>
                ))}

                <div className="glass-card p-8 bg-slate-50 border-emerald-100 flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm">
                        <Info className="text-slate-400" size={24} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-black text-slate-900">Custom Nutrition Plan</h4>
                        <p className="text-slate-500 font-medium text-sm">Need a month-long detailed chart? Request our expert nutritionists.</p>
                    </div>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">
                        Request Full Plan
                    </button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default NutritionDetail;
