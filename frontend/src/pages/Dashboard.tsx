import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Calendar, Salad, TrendingUp, Plus, ChevronRight, Activity, Zap, ArrowUpRight, Sparkles, Search, Trash2, Utensils, Coffee, Sun, MoonStar, Target } from 'lucide-react';
import { CALORIE_REFERENCE_DATA, type ReferenceFood } from '../data/calorieReference';

const REFERENCE_FOODS: ReferenceFood[] = (() => {
  const unique = new Map<string, ReferenceFood>();
  CALORIE_REFERENCE_DATA.forEach(cat => {
    cat.items.forEach(item => {
      if (!unique.has(item.name)) {
        unique.set(item.name, item);
      }
    });
  });
  return Array.from(unique.values());
})();
import AestheticBackground from '../components/AestheticBackground';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import bgDashboard from '../assets/dashboard.jpg';

interface DashboardProps { setIsAuthenticated: (val: boolean) => void; }

interface HealthData {
  bmi: number;
  bmiCategory: string;
  dailyCalories: number;
  weight: number;
  height: number;
}

interface FoodEntry {
  id: string;
  foodId: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: string;
  unit: string;
  time: string;
}

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

const CircularProgress = ({
  size = 120,
  strokeWidth = 10,
  percentage = 0,
  color = "#10b981",
  label = "",
  subLabel = "",
  glow = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={glow ? "filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" : ""}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-black text-slate-900 leading-none">{label}</span>
        {subLabel && <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{subLabel}</span>}
      </div>
    </div>
  );
};

const Dashboard = ({ setIsAuthenticated }: DashboardProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [health, setHealth] = useState<HealthData>({ bmi: 0, bmiCategory: 'Calculating...', dailyCalories: 2000, weight: 0, height: 0 });
  const [foodLog, setFoodLog] = useState<FoodEntry[]>(readLog());

  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<ReferenceFood | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [isPremium, setIsPremium] = useState(false);


  const todayTotal = foodLog.reduce((s, e) => s + e.calories, 0);
  const calorieTarget = health.dailyCalories || 2000;
  const calRemaining = Math.max(calorieTarget - todayTotal, 0);
  const calPct = Math.min((todayTotal / (calorieTarget || 1)) * 100, 100);


  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }
    try {
      const res = await axios.get('http://localhost:5001/api/health-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.data.profileComplete) { navigate('/onboarding'); return; }
      if (res.data.name) setUserName(res.data.name);
      if (res.data.isPremium) setIsPremium(true);
      const h = res.data.health;
      setHealth({
        bmi: Number(h.bmi) || 0,
        bmiCategory: h.bmiCategory || 'Unknown',
        dailyCalories: Number(h.dailyCalories) || 2000,
        weight: Number(h.weight) || 0,
        height: Number(h.height) || 0,
      });
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

  const handleAddFood = () => {
    if (!selectedFood || isNaN(Number(quantity)) || Number(quantity) <= 0) return;

    const qty = Number(quantity);
    const entry: FoodEntry = {
      id: Date.now().toString(),
      foodId: selectedFood.name,
      name: selectedFood.name,
      quantity: qty,
      calories: Math.round(selectedFood.kcal * qty),
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: selectedMealType,
      unit: selectedFood.qty,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [...foodLog, entry];
    setFoodLog(updated);
    writeLog(updated);
    toast.success(`Added ${selectedFood.name} to log!`);
    setSelectedFood(null);
    setSearchQuery('');
    setQuantity('1');
    setShowAddFood(false);
  };

  const deleteFoodEntry = (id: string) => {
    const updated = foodLog.filter(f => f.id !== id);
    setFoodLog(updated);
    writeLog(updated);
    toast.success('Food entry removed.');
  };



  const totals = foodLog.reduce((acc, f) => ({
    calories: acc.calories + f.calories,
    protein: acc.protein + f.protein,
    carbs: acc.carbs + f.carbs,
    fats: acc.fats + f.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const getMealTotal = (type: string) => {
    return foodLog.filter(f => f.mealType === type).reduce((s, e) => s + e.calories, 0);
  };

  const filteredFoods = REFERENCE_FOODS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <AestheticBackground bgImage={bgDashboard} />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-10 space-y-10 relative z-10 py-12">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                Hello, <span className="text-emerald-600 capitalize">{userName}</span> 👋
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Your Holistic Intelligence Dashboard</p>
                {isPremium && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 animate-pulse">
                    <Sparkles size={12} /> Premium
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-sm"
          >
            <div className="flex flex-col items-end pr-6 border-r border-white/20">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Current BMI</span>
              <span className="text-2xl font-black text-white">{health.bmi.toFixed(1)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Weight Status</span>
              <span className={`text-xs font-black uppercase tracking-tighter ${health.bmiCategory === 'Normal' ? 'text-emerald-400' : 'text-amber-400'}`}>{health.bmiCategory}</span>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {[
            { title: 'Health', desc: 'Analytics', points: 'BMI · Biometrics', icon: <Activity size={24} />, iconBg: 'bg-blue-50', text: 'text-blue-600', cardBg: 'border-blue-100 hover:bg-blue-50/30', path: '/health' },
            { title: 'Nutrition', desc: 'Diet Plan', points: 'Meal Guides · Recipes', icon: <Salad size={24} />, iconBg: 'bg-emerald-50', text: 'text-emerald-600', cardBg: 'border-emerald-100 hover:bg-emerald-50/30', path: '/nutrition' },
            { title: 'One to One Consultancy', desc: 'Booking', points: 'Consultations · Chat', icon: <Calendar size={24} />, iconBg: 'bg-amber-50', text: 'text-amber-600', cardBg: 'border-amber-100 hover:bg-amber-50/30', path: '/sessions' }
          ].map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(item.path)}
              className={`glass-card p-6 sm:p-8 group flex flex-col gap-6 transition-all duration-500 border-2 ${item.cardBg} hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start w-full">
                <div className={`w-14 h-14 ${item.iconBg} ${item.text} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>{item.icon}</div>
                <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-emerald-600 group-hover:bg-white transition-all"><ArrowUpRight size={18} /></div>
              </div>
              <div className="text-left">
                <h3 className="font-black text-xl text-slate-900 leading-none">{item.title}</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{item.desc}</p>
                <div className="h-px bg-slate-100 w-full my-4"></div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{item.points}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="glass-card overflow-hidden border-2 border-slate-50 relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-50"></div>

              <div className="p-8 sm:p-10 space-y-10">
                <header className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Calorie Counter</h2>
                  </div>
                  <button
                    onClick={() => setShowAddFood(!showAddFood)}
                    className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${showAddFood
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-0.5'
                      }`}
                  >
                    {showAddFood ? <ChevronRight size={16} /> : <Plus size={16} />} {showAddFood ? 'Close' : 'New Entry'}
                  </button>
                </header>

                <div className="space-y-12">
                  {/* Top Section: Metrics & Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    {/* Calorie Overview */}
                    <div className="lg:col-span-8 flex flex-col">
                      <div className="relative p-6 sm:p-10 bg-emerald-50/30 rounded-[2.5rem] sm:rounded-[3.5rem] border border-emerald-100/50 overflow-hidden group/main h-full flex items-center">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-200/20 blur-[80px] rounded-full group-hover/main:scale-110 transition-transform duration-1000"></div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 relative z-10 w-full">
                          <CircularProgress
                            size={140}
                            strokeWidth={14}
                            percentage={calPct}
                            color="#10b981"
                            label={totals.calories.toString()}
                            subLabel="KCAL"
                          />

                          <div className="flex-1 space-y-6 text-center sm:text-left">
                            <div className="space-y-1">
                              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{calRemaining}</p>
                              <p className="text-[10px] font-black text-emerald-800 tracking-[0.2em] uppercase">Calories Remaining</p>
                            </div>
                            <div className="flex items-center gap-6 justify-center sm:justify-start">
                              <div className="flex items-center gap-2">
                                <Target size={14} className="text-slate-600" />
                                <span className="text-xs font-bold text-slate-700">{calorieTarget} Target</span>
                              </div>
                              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                              <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700">{calPct.toFixed(0)}% Done</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Daily Accumulation (Enhanced UI) */}
                    <div className="lg:col-span-4">
                      <div className="glass-card p-6 sm:p-8 bg-slate-900/80 text-white rounded-[2.5rem] sm:rounded-[3.5rem] h-full flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500"></div>
                        <div className="space-y-8">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Daily Accumulation</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black leading-none text-emerald-400">{totals.calories}</span>
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Kcal Total</span>
                              </div>
                              {/* Calorie badge */}
                              <p className="badge badge-calorie mt-2">{totals.calories} kcal</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-3xl border border-white/10">
                              <TrendingUp size={24} className="text-emerald-500" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          {[
                            { label: 'Proteins', val: totals.protein.toFixed(0), target: 120, color: 'bg-blue-500' },
                            { label: 'Carbs', val: totals.carbs.toFixed(0), target: 300, color: 'bg-amber-500' },
                            { label: 'Fats', val: totals.fats.toFixed(0), target: 80, color: 'bg-rose-500' }
                          ].map(m => (
                            <div key={m.label} className="space-y-2">
                              <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">
                                <span>{m.label}</span>
                                <span className="text-white">{m.val}g <span className="opacity-60">/ {m.target}g</span></span>
                              </div>
                              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((Number(m.val) / m.target) * 100, 100)}%` }} transition={{ duration: 1 }} className={`h-full ${m.color}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meal Breakdown Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[
                      { name: 'Breakfast', icon: <Coffee size={16} />, color: 'bg-amber-100 text-amber-600', bColor: 'border-amber-100' },
                      { name: 'Lunch', icon: <Sun size={16} />, color: 'bg-emerald-100 text-emerald-600', bColor: 'border-emerald-100' },
                      { name: 'Snacks', icon: <Utensils size={16} />, color: 'bg-blue-100 text-blue-600', bColor: 'border-blue-100' },
                      { name: 'Dinner', icon: <MoonStar size={16} />, color: 'bg-indigo-100 text-indigo-600', bColor: 'border-indigo-100' }
                    ].map(meal => (
                      <div key={meal.name} className={`p-4 sm:p-6 bg-white/80 rounded-[2.5rem] border ${meal.bColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 sm:gap-6 group/meal`}>
                        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${meal.color} group-hover/meal:scale-110 transition-transform`}>
                          {meal.icon}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{meal.name}</p>
                          <p className="text-xl font-black text-slate-900 leading-none">
                            {getMealTotal(meal.name)}
                            <span className="text-[10px] text-slate-300 font-normal ml-1">KCAL</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>


                  <AnimatePresence>
                    {showAddFood && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 sm:p-12 bg-slate-950 rounded-[3.5rem] space-y-12 shadow-2xl border border-white/5 relative overflow-hidden">
                          {/* Decorative elements */}
                          <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                          <div className="absolute -left-20 bottom-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                          <div className="space-y-12 relative z-10">
                            {/* Selection Blocks */}
                            <div className="grid grid-cols-1 gap-12">
                              {/* 01. Meal Type */}
                              <div className="space-y-5">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-4">
                                  <span className="w-8 h-px bg-emerald-500/30"></span> 01. Select Meal
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    { name: 'Breakfast', icon: <Coffee size={14} /> },
                                    { name: 'Lunch', icon: <Sun size={14} /> },
                                    { name: 'Snacks', icon: <Utensils size={14} /> },
                                    { name: 'Dinner', icon: <MoonStar size={14} /> }
                                  ].map(meal => (
                                    <button
                                      key={meal.name}
                                      onClick={() => setSelectedMealType(meal.name)}
                                      className={`flex items-center gap-2 px-4 py-3 rounded-full font-black text-[9px] uppercase tracking-widest transition-all border ${selectedMealType === meal.name ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-[1.05]' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300'}`}
                                    >
                                      {meal.icon}
                                      {meal.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Action Blocks */}
                            <div className="space-y-10 pt-4 border-t border-white/5">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* 03. Search */}
                                <div className="space-y-5">
                                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-8 h-px bg-emerald-500/30"></span> 02. Find Food
                                  </p>
                                  <div className="relative group/search">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within/search:text-emerald-500" size={18} />
                                    <input
                                      type="text"
                                      placeholder="Enter food name..."
                                      className="w-full bg-white/5 border border-white/10 text-white pl-16 pr-6 py-5 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 font-bold placeholder:text-slate-700 transition-all text-sm"
                                      value={searchQuery}
                                      onChange={e => { setSearchQuery(e.target.value); setSelectedFood(null); }}
                                    />
                                    {searchQuery && !selectedFood && (
                                      <div className="absolute top-full left-0 w-full mt-4 bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-3xl">
                                        {filteredFoods.length > 0 ? filteredFoods.map(f => (
                                          <button
                                            key={f.name}
                                            onClick={() => { setSelectedFood(f); setSearchQuery(f.name); }}
                                            className="w-full px-8 py-5 text-left hover:bg-emerald-500 group/item transition-all border-b border-white/5 last:border-0 flex justify-between items-center"
                                          >
                                            <div>
                                              <p className="font-bold text-sm text-slate-200 group-hover/item:text-white transition-colors">{f.name}</p>
                                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1 group-hover/item:text-emerald-100 transition-colors">Portion: {f.qty}</p>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-500 group-hover/item:text-white transition-colors">{f.kcal} <span className="opacity-40">cal</span></div>
                                          </button>
                                        )) : <div className="px-8 py-8 text-slate-600 text-sm italic text-center">No results for "{searchQuery}"</div>}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* 04. Quantity */}
                                <div className="space-y-5">
                                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-8 h-px bg-emerald-500/30"></span> 03. Quantity
                                  </p>
                                  <div className="flex gap-4">
                                    {/* Quantity Input */}
                                    <div className="flex-[1.5] relative">
                                      <style>{`
                                                input::-webkit-outer-spin-button,
                                                input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                                                input[type=number] { -moz-appearance: textfield; }
                                              `}</style>
                                      <input
                                        type="number"
                                        placeholder={selectedFood ? `Portions (Reference: ${selectedFood.qty})` : "Enter amount"}
                                        className="w-full h-full bg-white/5 border border-white/10 text-white px-6 py-5 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 font-black text-xl transition-all disabled:opacity-50"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        min="1"
                                        disabled={!selectedFood}
                                      />
                                    </div>

                                    {/* Unit / Calory Box */}
                                    <div className="flex-1 bg-emerald-500 text-white px-4 py-5 rounded-3xl flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20">
                                      <p className="text-2xl font-black leading-none">{selectedFood ? Math.round(selectedFood.kcal * Number(quantity)) : 0}</p>
                                      <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">
                                        {selectedFood ? `${selectedFood.qty} / KCAL` : "PORTION / KCAL"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>

                          <button
                            onClick={handleAddFood}
                            disabled={!selectedFood}
                            className="w-full group py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-900/40 disabled:opacity-20 disabled:grayscale hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-4"
                          >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                            Confirm Entry
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 4: Today's Food Log (Stretched) */}
                <div className="lg:col-span-12">
                  <div className="bg-slate-50/50 rounded-[1.75rem] sm:rounded-[2rem] border border-slate-100 flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-white flex justify-between items-center shrink-0">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Food Log</h4>
                      <div className="px-3 py-1 bg-white rounded-full text-[9px] font-black text-slate-400 border border-slate-100">{foodLog.length} Items</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 custom-scrollbar relative">
                      {foodLog.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                          <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 shadow-inner"><Salad size={48} /></div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Your log is empty<br /><span className="text-[10px] font-normal lowercase tracking-widest mt-1 opacity-60">Add some delicious meals above</span></p>
                        </div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {foodLog.map((f, idx) => (
                            <motion.div
                              key={f.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-4 sm:p-5 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_15px_40px_rgba(16,185,129,0.1)] hover:border-emerald-100/50 transition-all flex justify-between items-center relative overflow-hidden"
                            >
                              <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all"></div>
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                  {f.mealType === 'Breakfast' ? '🍳' : f.mealType === 'Lunch' ? '☀️' : f.mealType === 'Snacks' ? '☕' : '🌙'}
                                </div>
                                <div>
                                  <h5 className="font-black text-slate-800 text-sm">{f.name}</h5>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                    {f.quantity} {f.unit} <span className="mx-1 text-slate-200">·</span> {f.mealType}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-300 uppercase mt-1 flex items-center gap-1"><Zap size={10} className="text-emerald-400" /> {f.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="font-black text-slate-900 text-lg leading-none">{f.calories} <span className="text-[9px] text-slate-300 font-normal uppercase tracking-widest ml-0.5">Kcal</span></p>
                                </div>
                                <button
                                  onClick={() => deleteFoodEntry(f.id)}
                                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
