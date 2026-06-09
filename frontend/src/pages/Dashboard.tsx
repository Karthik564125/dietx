import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import {
  Calendar, Salad, TrendingUp, Plus, Activity,
  Zap, ArrowUpRight, Sparkles, Search, Trash2, Utensils,
  Coffee, Sun, MoonStar, Target, X, ShoppingCart, CheckCircle2, Minus
} from 'lucide-react';
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
import { API_BASE_URL } from '../config';

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

/** A pending item in the cart before it's committed to the log */
interface CartItem {
  food: ReferenceFood;
  quantity: number;
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
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

// ─── Mobile Bottom Sheet ──────────────────────────────────────────────────────
const MobileBottomSheet = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[210] bg-slate-950 rounded-t-[2.5rem] max-h-[92dvh] flex flex-col overflow-hidden border-t border-white/10 shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            {/* Header bar inside sheet */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 shrink-0">
              <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">New Entry</p>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Cart Item Row ─────────────────────────────────────────────────────────────
const CartRow = ({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQtyChange: (q: number) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="flex items-center gap-3 p-3 bg-white/5 border border-white/8 rounded-2xl"
  >
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-white truncate">{item.food.name}</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
        {item.food.qty} · {Math.round(item.food.kcal * item.quantity)} kcal
      </p>
    </div>
    {/* Qty stepper */}
    <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
      <button
        onClick={() => onQtyChange(Math.max(1, item.quantity - 1))}
        className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all"
      >
        <Minus size={10} />
      </button>
      <span className="text-xs font-black text-white w-6 text-center">{item.quantity}</span>
      <button
        onClick={() => onQtyChange(item.quantity + 1)}
        className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
      >
        <Plus size={10} />
      </button>
    </div>
    <button
      onClick={onRemove}
      className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
    >
      <Trash2 size={14} />
    </button>
  </motion.div>
);

// ─── Add Food Form (shared between desktop panel & mobile sheet) ──────────────
const AddFoodForm = ({
  selectedMealType,
  setSelectedMealType,
  cart,
  setCart,
  onConfirm,
  compact = false,
}: {
  selectedMealType: string;
  setSelectedMealType: (m: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onConfirm: () => void;
  compact?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<ReferenceFood | null>(null);
  const [quantity, setQuantity] = useState('1');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFoods = REFERENCE_FOODS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  const cartTotal = cart.reduce((s, c) => s + Math.round(c.food.kcal * c.quantity), 0);

  const addToCart = () => {
    if (!selectedFood || isNaN(Number(quantity)) || Number(quantity) <= 0) return;
    const qty = Number(quantity);
    setCart(prev => {
      // If same food already in cart, just bump qty
      const existing = prev.findIndex(c => c.food.name === selectedFood.name);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + qty };
        return updated;
      }
      return [...prev, { food: selectedFood, quantity: qty }];
    });
    toast.success(`${selectedFood.name} added to cart`, { duration: 1500 });
    setSelectedFood(null);
    setSearchQuery('');
    setQuantity('1');
    // Refocus search so user can keep adding
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const removeFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  const updateCartQty = (idx: number, q: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: q };
      return updated;
    });
  };

  const meals = [
    { name: 'Breakfast', icon: <Coffee size={12} /> },
    { name: 'Lunch', icon: <Sun size={12} /> },
    { name: 'Snacks', icon: <Utensils size={12} /> },
    { name: 'Dinner', icon: <MoonStar size={12} /> },
  ];

  const p = compact ? 'p-5' : 'p-8 sm:p-12';

  return (
    <div className={`${p} bg-slate-950 ${compact ? '' : 'rounded-[3.5rem]'} space-y-8 relative overflow-hidden`}>
      {/* Decorative blobs */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -left-20 bottom-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="space-y-8 relative z-10">
        {/* 01. Meal Type */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
            <span className="w-6 h-px bg-emerald-500/30" /> 01. Meal
          </p>
          <div className="flex flex-wrap gap-2">
            {meals.map(meal => (
              <button
                key={meal.name}
                onClick={() => setSelectedMealType(meal.name)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-black text-[9px] uppercase tracking-widest transition-all border ${selectedMealType === meal.name
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-[1.05]'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                  }`}
              >
                {meal.icon}
                {meal.name}
              </button>
            ))}
          </div>
        </div>

        {/* 02. Search + Add to Cart */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
            <span className="w-6 h-px bg-emerald-500/30" /> 02. Add Items
          </p>

          <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/search:text-emerald-500 transition-colors" size={16} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search food…"
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold placeholder:text-slate-700 transition-all text-sm"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSelectedFood(null); }}
              />
              {/* Dropdown */}
              {searchQuery && !selectedFood && (
                <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100]">
                  {filteredFoods.length > 0 ? filteredFoods.map(f => (
                    <button
                      key={f.name}
                      onClick={() => { setSelectedFood(f); setSearchQuery(f.name); }}
                      className="w-full px-5 py-3.5 text-left hover:bg-emerald-500 group/item transition-all border-b border-white/5 last:border-0 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-200 group-hover/item:text-white">{f.name}</p>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5 group-hover/item:text-emerald-100">{f.qty}</p>
                      </div>
                      <div className="text-[10px] font-black text-slate-500 group-hover/item:text-white">{f.kcal} kcal</div>
                    </button>
                  )) : (
                    <div className="px-5 py-6 text-slate-600 text-sm italic text-center">No results for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="w-20 relative">
              <style>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }
              `}</style>
              <input
                type="number"
                className="w-full h-full bg-white/5 border border-white/10 text-white px-3 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-black text-center text-lg transition-all disabled:opacity-30"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="1"
                disabled={!selectedFood}
              />
            </div>

            {/* Add button */}
            <button
              onClick={addToCart}
              disabled={!selectedFood}
              className="px-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 disabled:grayscale text-white rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 text-xs uppercase tracking-widest shrink-0"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          {/* Kcal preview */}
          {selectedFood && (
            <p className="text-[10px] text-slate-500 font-bold tracking-widest pl-1">
              ≈ {Math.round(selectedFood.kcal * Number(quantity))} kcal per {quantity} × {selectedFood.qty}
            </p>
          )}
        </div>

        {/* 03. Cart */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
              <span className="w-6 h-px bg-emerald-500/30" /> 03. Cart
              {cart.length > 0 && (
                <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </p>
            {cartTotal > 0 && (
              <span className="text-[10px] font-black text-emerald-400 tracking-wider">
                {cartTotal} kcal total
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-6 flex flex-col items-center gap-2 opacity-30">
              <ShoppingCart size={28} className="text-slate-500" />
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Cart is empty</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <CartRow
                    key={item.food.name}
                    item={item}
                    onRemove={() => removeFromCart(idx)}
                    onQtyChange={q => updateCartQty(idx, q)}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Confirm */}
        <button
          onClick={onConfirm}
          disabled={cart.length === 0}
          className="w-full group py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-900/40 disabled:opacity-20 disabled:grayscale hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
          Log {cart.length > 0 ? `${cart.length} item${cart.length > 1 ? 's' : ''}` : 'Items'} · {cartTotal} kcal
        </button>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ setIsAuthenticated }: DashboardProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [health, setHealth] = useState<HealthData>({ bmi: 0, bmiCategory: 'Calculating...', dailyCalories: 2000, weight: 0, height: 0 });
  const [foodLog, setFoodLog] = useState<FoodEntry[]>(readLog());
  const [isPremium, setIsPremium] = useState(false);

  // Add-food panel state
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [cart, setCart] = useState<CartItem[]>([]);

  const todayTotal = foodLog.reduce((s, e) => s + e.calories, 0);
  const calorieTarget = health.dailyCalories || 2000;
  const calRemaining = Math.max(calorieTarget - todayTotal, 0);
  const calPct = Math.min((todayTotal / (calorieTarget || 1)) * 100, 100);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/health-profile`, {
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

  /** Commit all cart items to the food log */
  const handleConfirmCart = () => {
    if (cart.length === 0) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const newEntries: FoodEntry[] = cart.map(c => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      foodId: c.food.name,
      name: c.food.name,
      quantity: c.quantity,
      calories: Math.round(c.food.kcal * c.quantity),
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: selectedMealType,
      unit: c.food.qty,
      time: now,
    }));
    const updated = [...foodLog, ...newEntries];
    setFoodLog(updated);
    writeLog(updated);
    toast.success(`Added ${cart.length} item${cart.length > 1 ? 's' : ''} to ${selectedMealType}!`);
    setCart([]);
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

  const getMealTotal = (type: string) =>
    foodLog.filter(f => f.mealType === type).reduce((s, e) => s + e.calories, 0);

  const openAddFood = () => {
    setCart([]);
    setShowAddFood(true);
  };

  const closeAddFood = () => {
    setShowAddFood(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={bgDashboard} />

      {/* ── Mobile Bottom Sheet (only on < lg screens) ── */}
      <div className="lg:hidden">
        <MobileBottomSheet open={showAddFood} onClose={closeAddFood}>
          <AddFoodForm
            selectedMealType={selectedMealType}
            setSelectedMealType={setSelectedMealType}
            cart={cart}
            setCart={setCart}
            onConfirm={handleConfirmCart}
            compact
          />
        </MobileBottomSheet>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-10 space-y-10 relative z-10 py-12">
        {/* ── Header ── */}
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
            className="flex items-center gap-6 p-5 bg-[#FFEBE3] rounded-[2rem] border-2 border-[#FFD4C4] shadow-lg"
          >
            <div className="flex flex-col items-end pr-6 border-r-2 border-[#FFD4C4]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current BMI</span>
              <span className="text-2xl font-black text-slate-900">{health.bmi.toFixed(1)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Weight Status</span>
              <span className={`text-xs font-black uppercase tracking-tighter ${health.bmiCategory === 'Normal' ? 'text-emerald-600' : 'text-amber-600'}`}>{health.bmiCategory}</span>
            </div>
          </motion.div>
        </header>

        {/* ── Nav Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {[
            { title: 'Health', desc: 'Analytics', points: 'BMI · Biometrics', icon: <Activity size={24} />, iconBg: 'bg-blue-50', text: 'text-blue-600', cardBg: 'border-blue-200/80', path: '/health' },
            { title: 'Nutrition', desc: 'Diet Plan', points: 'Meal Guides · Recipes', icon: <Salad size={24} />, iconBg: 'bg-emerald-50', text: 'text-emerald-600', cardBg: 'border-emerald-200/80', path: '/nutrition' },
            { title: 'One to One Consultancy', desc: 'Booking', points: 'Consultations · Chat', icon: <Calendar size={24} />, iconBg: 'bg-amber-50', text: 'text-amber-600', cardBg: 'border-amber-200/80', path: '/sessions' }
          ].map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(item.path)}
              className={`peach-card p-6 sm:p-8 group flex flex-col gap-6 transition-all duration-500 border-2 ${item.cardBg} hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start w-full">
                <div className={`w-14 h-14 ${item.iconBg} ${item.text} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>{item.icon}</div>
                <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:bg-white transition-all"><ArrowUpRight size={18} /></div>
              </div>
              <div className="text-left">
                <h3 className="font-black text-xl text-slate-900 leading-none">{item.title}</h3>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2">{item.desc}</p>
                <div className="h-px bg-slate-200 w-full my-4" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{item.points}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Calorie Counter Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="peach-card overflow-hidden border-2 border-[#FFD4C4] relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-50" />

              <div className="p-8 sm:p-10 space-y-10">
                {/* Section header */}
                <header className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Calorie Counter</h2>
                  </div>
                  <button
                    onClick={showAddFood ? closeAddFood : openAddFood}
                    className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${showAddFood
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-0.5'
                      }`}
                  >
                    {showAddFood ? <X size={16} /> : <Plus size={16} />} {showAddFood ? 'Close' : 'New Entry'}
                  </button>
                </header>

                <div className="space-y-12">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    {/* Calorie Overview */}
                    <div className="lg:col-span-8 flex flex-col">
                      <div className="relative p-6 sm:p-10 bg-[#FFDFD3] rounded-[2.5rem] sm:rounded-[3.5rem] border-2 border-[#FFC8B4] overflow-hidden group/main h-full flex items-center">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-200/20 blur-[80px] rounded-full group-hover/main:scale-110 transition-transform duration-1000" />
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
                              <div className="w-1 h-1 bg-slate-300 rounded-full" />
                              <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700">{calPct.toFixed(0)}% Done</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Daily Accumulation */}
                    <div className="lg:col-span-4">
                      <div className="glass-card p-6 sm:p-8 bg-slate-900/80 text-white rounded-[2.5rem] sm:rounded-[3.5rem] h-full flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500" />
                        <div className="space-y-8">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Daily Accumulation</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black leading-none text-emerald-400">{totals.calories}</span>
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Kcal Total</span>
                              </div>
                              <p className="badge badge-calorie mt-2">{totals.calories} kcal</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-3xl border border-white/10">
                              <TrendingUp size={24} className="text-emerald-500" />
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:block space-y-5">
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

                  {/* Meal Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[
                      { name: 'Breakfast', icon: <Coffee size={16} />, color: 'bg-amber-100 text-amber-600', bColor: 'border-amber-200' },
                      { name: 'Lunch', icon: <Sun size={16} />, color: 'bg-emerald-100 text-emerald-600', bColor: 'border-emerald-200' },
                      { name: 'Snacks', icon: <Utensils size={16} />, color: 'bg-blue-100 text-blue-600', bColor: 'border-blue-200' },
                      { name: 'Dinner', icon: <MoonStar size={16} />, color: 'bg-indigo-100 text-indigo-600', bColor: 'border-indigo-200' }
                    ].map(meal => (
                      <div key={meal.name} className={`p-3 sm:p-6 bg-white rounded-3xl sm:rounded-[2.5rem] border-2 ${meal.bColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 group/meal`}>
                        <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${meal.color} group-hover/meal:scale-110 transition-transform`}>
                          {meal.icon}
                        </div>
                        <div className="space-y-0.5 sm:space-y-1 text-center sm:text-left">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{meal.name}</p>
                          <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                            {getMealTotal(meal.name)}
                            <span className="text-[10px] text-slate-300 font-normal ml-0.5 sm:ml-1">KCAL</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Inline Add-Food Panel (hidden on mobile) */}
                  <AnimatePresence>
                    {showAddFood && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden hidden lg:block"
                      >
                        <AddFoodForm
                          selectedMealType={selectedMealType}
                          setSelectedMealType={setSelectedMealType}
                          cart={cart}
                          setCart={setCart}
                          onConfirm={handleConfirmCart}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Today's Food Log */}
                <div className="lg:col-span-12">
                  <div className="bg-[#FFF3EE] rounded-[1.75rem] sm:rounded-[2rem] border-2 border-[#FFD4C4] flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 sm:p-6 border-b-2 border-[#FFD4C4] flex justify-between items-center shrink-0">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today's Food Log</h4>
                      <div className="px-3 py-1 bg-white rounded-full text-[9px] font-black text-slate-500 border border-slate-200">{foodLog.length} Items</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 custom-scrollbar relative">
                      {foodLog.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 py-12">
                          <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 shadow-inner"><Salad size={48} /></div>
                          <p className="text-sm font-bold text-slate-600 uppercase tracking-[0.2em]">Your log is empty<br /><span className="text-[10px] font-normal lowercase tracking-widest mt-1 opacity-60">Add some delicious meals above</span></p>
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
                              className="p-3 sm:p-5 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] group hover:shadow-[0_15px_40px_rgba(16,185,129,0.1)] hover:border-emerald-100/50 transition-all flex justify-between items-center relative overflow-hidden"
                            >
                              <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
                              <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0">
                                  {f.mealType === 'Breakfast' ? '🍳' : f.mealType === 'Lunch' ? '☀️' : f.mealType === 'Snacks' ? '☕' : '🌙'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-black text-slate-800 text-xs sm:text-sm truncate">{f.name}</h5>
                                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider sm:tracking-widest mt-0.5 truncate">
                                    {f.quantity} {f.unit} <span className="mx-0.5 sm:mx-1 text-slate-200">·</span> {f.mealType}
                                  </p>
                                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase mt-0.5 sm:mt-1 flex items-center gap-1"><Zap size={8} className="text-emerald-400" /> {f.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-6 shrink-0 ml-2">
                                <div className="text-right">
                                  <p className="font-black text-slate-900 text-sm sm:text-lg leading-none">{f.calories} <span className="text-[8px] sm:text-[9px] text-slate-300 font-normal uppercase tracking-widest ml-0.5">Kcal</span></p>
                                </div>
                                <button
                                  onClick={() => deleteFoodEntry(f.id)}
                                  className="p-2 sm:p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                >
                                  <Trash2 size={16} />
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
