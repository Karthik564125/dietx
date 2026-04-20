import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Calendar, 
  Salad, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  Droplet, 
  Activity, 
  Zap,
  ArrowUpRight,
  Save,
  Moon
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────── */
interface DashboardProps { setIsAuthenticated: (val: boolean) => void; }

interface HealthData {
  bmi: number;
  bmiCategory: string;
  dailyCalories: number;
  weight: number;
  height: number;
}

interface FoodEntry { id: string; name: string; calories: number; time: string; }

/* ── LocalStorage calorie log helper ───────────────── */
const TODAY = new Date().toISOString().slice(0, 10);
const CALORIE_LOG_KEY = 'dietx_food_log';

const readLog = (): FoodEntry[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(CALORIE_LOG_KEY) ?? '{}');
    return Array.isArray(raw[TODAY]) ? raw[TODAY] : [];
  } catch { return []; }
};

const writeLog = (entries: FoodEntry[]) => {
  try {
    const raw = JSON.parse(localStorage.getItem(CALORIE_LOG_KEY) ?? '{}');
    raw[TODAY] = entries;
    localStorage.setItem(CALORIE_LOG_KEY, JSON.stringify(raw));
  } catch { /* ignore */ }
};

const Dashboard = ({ setIsAuthenticated }: DashboardProps) => {
  const navigate = useNavigate();
  const [userName, setUserName]       = useState('User');
  const [health, setHealth]           = useState<HealthData>({ bmi: 0, bmiCategory: 'Calculating...', dailyCalories: 2000, weight: 0, height: 0 });
  const [foodLog, setFoodLog]         = useState<FoodEntry[]>(readLog());
  const [waterCount, setWaterCount]   = useState<number>(0);
  const [sleepHours, setSleepHours]   = useState<number>(0);
  const [showAddFood, setShowAddFood] = useState(false);
  const [foodName, setFoodName]       = useState('');
  const [foodCal, setFoodCal]         = useState('');
  const [savingTracking, setSavingTracking] = useState<string | null>(null); // 'water' or 'sleep'
  const nameRef = useRef<HTMLInputElement>(null);

  /* derived */
  const todayTotal = foodLog.reduce((s, e) => s + e.calories, 0);
  const calorieTarget = health.dailyCalories || 2000;
  const calRemaining  = Math.max(calorieTarget - todayTotal, 0);
  const calPct        = Math.min((todayTotal / (calorieTarget || 1)) * 100, 100);
  const waterTarget   = 8; 

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }

    try {
      const res = await axios.get('http://localhost:5001/api/health-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.data.profileComplete) { navigate('/onboarding'); return; }
      if (res.data.name) setUserName(res.data.name);
      
      const h = res.data.health;
      setHealth({
        bmi:          Number(h.bmi) || 0,
        bmiCategory:  h.bmiCategory || 'Unknown',
        dailyCalories: Number(h.dailyCalories) || 2000,
        weight:        Number(h.weight) || 0,
        height:        Number(h.height) || 0,
      });

      if (h.lastEntryDate === TODAY) {
        setWaterCount(h.waterIntake || 0);
        setSleepHours(h.sleepHours || 0);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/auth');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const saveTracker = async (type: 'water' | 'sleep') => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setSavingTracking(type);
    try {
      await axios.post('http://localhost:5001/api/daily-tracking', {
        waterIntake: waterCount,
        sleepHours: sleepHours,
        date: TODAY
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Save tracking error', err);
    } finally {
      setSavingTracking(null);
    }
  };

  const handleAddFood = () => {
    if (!foodName.trim() || !foodCal || isNaN(Number(foodCal)) || +foodCal <= 0) return;
    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: foodName.trim(),
      calories: Math.round(Number(foodCal)),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [...foodLog, entry];
    setFoodLog(updated);
    writeLog(updated);
    setFoodName(''); setFoodCal(''); setShowAddFood(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-12 py-12">

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Hello, <span className="text-emerald-600 capitalize">{userName}</span> 👋
            </h1>
            <p className="text-slate-500 font-bold text-lg mt-2">Personal Holistic Dashboard</p>
          </div>
          <div className="flex gap-4">
               {/* Button removed from here */}
          </div>
        </header>

        {/* ── Action Navigation ── */}
            {[
              { 
                title: 'Health', 
                desc: 'Analytics', 
                points: 'BMI · Weight Trends · Biometrics',
                icon: <Activity size={28} />, 
                bg: 'bg-blue-50', 
                text: 'text-blue-600', 
                path: '/health' 
              },
              { 
                title: 'Nutrition', 
                desc: 'Diet Plan', 
                points: 'Calorie Goals · Meal Guides · Recipes',
                icon: <Salad size={28} />, 
                bg: 'bg-emerald-50', 
                text: 'text-emerald-600', 
                path: '/nutrition' 
              },
              { 
                title: 'Sessions', 
                desc: 'Booking', 
                points: 'Consultations · Expert Chat · Booking',
                icon: <Calendar size={28} />, 
                bg: 'bg-amber-50', 
                text: 'text-amber-600', 
                path: '/sessions' 
              }
            ].map((item, i) => (
              <button 
                key={i}
                onClick={() => navigate(item.path)}
                className="glass-card p-8 group flex items-center justify-between border-transparent hover:border-emerald-100"
              >
                 <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       {item.icon}
                    </div>
                    <div className="text-left">
                       <h3 className="font-black text-xl text-slate-900">{item.title}</h3>
                       <p className="text-sm font-bold text-slate-400">{item.desc}</p>
                       <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-wider">{item.points}</p>
                    </div>
                 </div>
                 <ArrowUpRight size={20} className="text-slate-200 group-hover:text-emerald-600 transition-colors" />
              </button>
            ))}

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
             
             {/* Calorie Card */}
             <section className="glass-card p-10 space-y-10">
                <header className="flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-900">Energy Engine</h2>
                   <button 
                     onClick={() => { setShowAddFood(!showAddFood); setTimeout(() => nameRef.current?.focus(), 100); }}
                     className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center gap-2"
                   >
                     <Plus size={18} /> New Entry
                   </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6 flex flex-col justify-center">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-5xl font-black text-slate-900">{todayTotal}</p>
                            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">kcal Ingested</p>
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-black text-slate-300">{calorieTarget}</p>
                            <p className="text-[10px] font-black text-slate-200 tracking-widest uppercase">Target Goal</p>
                         </div>
                      </div>
                      <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${calPct}%` }} />
                      </div>
                      <p className="text-xs font-bold text-slate-400">{calRemaining} kcal remaining for today</p>
                   </div>

                   <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                      {foodLog.length === 0 ? (
                        <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 font-bold">No logs yet</div>
                      ) : (
                        foodLog.map(f => (
                          <div key={f.id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-emerald-100 transition-colors">
                             <div className="flex items-center gap-3">
                                <span className="bg-white p-2 rounded-lg text-lg shadow-sm">🥗</span>
                                <span className="font-bold text-slate-700">{f.name}</span>
                             </div>
                             <span className="font-black text-slate-900">{f.calories} <span className="text-[10px]">KCAL</span></span>
                          </div>
                        ))
                      )}
                   </div>
                </div>

                {showAddFood && (
                  <div className="p-8 bg-slate-900 rounded-[2rem] space-y-4 animate-in slide-in-from-top-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                          ref={nameRef}
                          type="text" 
                          placeholder="Food Name"
                          className="bg-white/10 text-white px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={foodName}
                          onChange={e => setFoodName(e.target.value)}
                        />
                        <input 
                          type="number" 
                          placeholder="Calories"
                          className="bg-white/10 text-white px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={foodCal}
                          onChange={e => setFoodCal(e.target.value)}
                        />
                     </div>
                     <button onClick={handleAddFood} className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black text-sm hover:bg-emerald-600 transition-all">Submit Entry</button>
                  </div>
                )}
             </section>

             {/* Functional Trackers */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Water */}
                <section className="glass-card p-8 flex flex-col gap-8">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Droplet size={20} /></div>
                         <h3 className="font-black text-slate-900">H2O Intake</h3>
                      </div>
                      <span className="text-xs font-black text-slate-300 uppercase">{waterCount}/{waterTarget} GL</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <button onClick={() => setWaterCount(p => Math.max(0, p - 1))} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-900 hover:text-white transition-all font-black text-xl">−</button>
                         <span className="text-5xl font-black text-slate-900">{waterCount}</span>
                         <button onClick={() => setWaterCount(p => Math.min(20, p + 1))} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-900 hover:text-white transition-all font-black text-xl">+</button>
                      </div>
                      <button 
                        onClick={() => saveTracker('water')}
                        disabled={savingTracking === 'water'}
                        className="p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                      >
                         {savingTracking === 'water' ? <Zap className="animate-spin" size={20} /> : <Save size={20} />}
                      </button>
                   </div>
                </section>

                {/* Sleep */}
                <section className="glass-card p-8 flex flex-col gap-8">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Moon size={20} /></div>
                         <h3 className="font-black text-slate-900">Sleep Depth</h3>
                      </div>
                      <span className="text-xs font-black text-slate-300 uppercase">{sleepHours} HR</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <button onClick={() => setSleepHours(p => Math.max(0, p - 0.5))} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-900 hover:text-white transition-all font-black text-xl">−</button>
                         <span className="text-5xl font-black text-slate-900">{sleepHours.toFixed(1)}</span>
                         <button onClick={() => setSleepHours(p => Math.min(24, p + 0.5))} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-900 hover:text-white transition-all font-black text-xl">+</button>
                      </div>
                      <button 
                        onClick={() => saveTracker('sleep')}
                        disabled={savingTracking === 'sleep'}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                      >
                         {savingTracking === 'sleep' ? <Zap className="animate-spin" size={20} /> : <Save size={20} />}
                      </button>
                   </div>
                </section>
             </div>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
             {/* Biological Vitals section removed as requested */}

             <footer className="glass-card p-10 text-center space-y-4">
                <p className="text-lg font-medium italic text-slate-500 leading-relaxed">
                  "Healing is a matter of time, but it is sometimes also a matter of opportunity."
                </p>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Dt. Madhavi Latha</p>
             </footer>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;
