import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PremiumNutritionCard from '../components/PremiumNutritionCard';
import axios from 'axios';
import { ArrowLeft, Salad, Flame, PieChart, Info, Lock, Loader2 } from 'lucide-react';
import AestheticBackground from '../components/AestheticBackground';
import bgDashboard from '../assets/dashboard.jpg';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { CALORIE_REFERENCE_DATA } from '../data/calorieReference';

interface NutritionDetailProps {
  setIsAuthenticated: (val: boolean) => void;
}

const NutritionDetail = ({ setIsAuthenticated }: NutritionDetailProps) => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('mrng_breakfast');
  const [recipesLoading, setRecipesLoading] = useState(false);

  const getCategoriesForFood = (name: string, catTitle: string): string[] => {
    const nameLower = name.toLowerCase();
    const catLower = catTitle.toLowerCase();
    const res: string[] = [];

    if (nameLower.includes("11 am") || nameLower === "average fruit bowl") {
      return ['11_mrng_snacks'];
    }
    if (catLower.includes("breakfast")) {
      res.push('mrng_breakfast');
    }
    if (catLower.includes("lunch")) {
      res.push('noon_lunch');
    }
    if (catLower.includes("north indian recipes")) {
      res.push('noon_lunch');
      res.push('nyt_dinner');
    }
    if (catLower.includes("snacks")) {
      res.push('snacks');
    }
    if (catLower.includes("dinner") || catLower.includes("soup")) {
      res.push('nyt_dinner');
    }
    if (catLower.includes("non-vegetarian")) {
      if (nameLower.includes("burji") || nameLower.includes("egg")) {
        res.push('mrng_breakfast');
      } else {
        res.push('noon_lunch');
        res.push('nyt_dinner');
      }
    }
    if (res.length === 0) {
      res.push('noon_lunch');
    }
    return res;
  };

  const recipes = (() => {
    const categories: Record<string, { name: string; macros: string; desc: string; cal: string; isNonVeg: boolean }[]> = {
      mrng_breakfast: [],
      '11_mrng_snacks': [],
      noon_lunch: [],
      snacks: [],
      nyt_dinner: []
    };

    CALORIE_REFERENCE_DATA.forEach(cat => {
      cat.items.forEach(item => {
        const nameLower = item.name.toLowerCase();
        const isNonVeg = cat.title === "Non-Vegetarian" ||
          nameLower.includes("egg") ||
          nameLower.includes("chicken") ||
          nameLower.includes("fish") ||
          nameLower.includes("mutton") ||
          nameLower.includes("beef") ||
          nameLower.includes("prawn") ||
          nameLower.includes("pork") ||
          nameLower.includes("bone");

        const mappedRecipe = {
          name: item.name,
          macros: `Portion: ${item.qty}`,
          desc: `Calorie reference food suggestion. Standard serving portion size is ${item.qty}.`,
          cal: `${item.kcal} kcal`,
          isNonVeg
        };

        const targetCats = getCategoriesForFood(item.name, cat.title);
        targetCats.forEach(c => {
          if (categories[c]) {
            categories[c].push(mappedRecipe);
          }
        });
      });
    });

    const makeUnique = (arr: typeof categories.mrng_breakfast) => {
      const seen = new Set<string>();
      return arr.filter(item => {
        if (seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
    };

    return {
      mrng_breakfast: makeUnique(categories.mrng_breakfast),
      '11_mrng_snacks': makeUnique(categories['11_mrng_snacks']),
      noon_lunch: makeUnique(categories.noon_lunch),
      snacks: makeUnique(categories.snacks),
      nyt_dinner: makeUnique(categories.nyt_dinner)
    };
  })();

  const handlePayment = async (amount: number) => {
    if (amount === 99) {
      setRecipesLoading(true);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to make a payment');
        return;
      }

      // 1. Create Order in Backend
      const { data } = await axios.post(
        `${API_BASE_URL}/api/payment/create-order`,
        { amount, planName: amount === 99 ? 'suggested_recipes' : 'personal_consultancy' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = data;

      // 2. Open Razorpay Checkout
      const consultationType = amount === 99 ? 'Suggested Recipes' : 'Personalized Nutrition';

      const options = {
        key: 'rzp_live_SzVEKJaiNjOm1R', // Live Key
        amount: order.amount,
        currency: order.currency,
        name: 'DietX Holistic Wellness',
        description: amount === 99 ? 'DietX - Suggested Recipes' : 'DietX - Personalized Nutrition Consultation',
        order_id: order.id,
        notes: { consultationType },
        handler: async (response: any) => {
          try {
            // 3. Verify Payment in Backend
            const verifyRes = await axios.post(
              `${API_BASE_URL}/api/payment/verify`,
              {
                ...response,
                userId: user?.id,
                email: user?.email,
                phone: user?.phone || response.contact,
                amount,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success('Payment Successful!');
              // Re-fetch health profile to update states
              axios.get(`${API_BASE_URL}/api/health-profile`, {
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(res => {
                  setHealth(res.data.health);
                  setUser({
                    id: res.data.userId || '',
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    isPremium: res.data.isPremium,
                    isRecipesUnlocked: res.data.isRecipesUnlocked
                  });
                })
                .catch(console.error);
            }
          } catch (err) {
            console.error(err);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#10b981', // Emerald 600
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed', error);
      toast.error('Failed to initiate payment');
    } finally {
      setRecipesLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${API_BASE_URL}/api/health-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setHealth(res.data.health);
        setUser({
          id: res.data.userId || '',
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          isPremium: res.data.isPremium,
          isRecipesUnlocked: res.data.isRecipesUnlocked
        });

      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-premium relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={bgDashboard} />

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
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none">
              Nutrition <span className="text-emerald-400">Strategy</span>
            </h1>
            <p className="text-white/60 font-bold text-lg sm:text-xl uppercase tracking-widest">Personalized Fuel Protocol</p>
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
              <h3 className="text-sm font-black text-white/60 uppercase tracking-widest">Macro-Nutrient Split</h3>
              <PieChart className="text-emerald-400" size={24} />
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Salad className="text-emerald-600" size={32} />
              Suggested Recipes
            </h2>

            {/* Category Tabs */}
            {user?.isRecipesUnlocked && (
              <div className="flex overflow-x-auto bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-fit whitespace-nowrap no-scrollbar">
                {[
                  { id: 'mrng_breakfast', label: 'mrng breakfast' },
                  { id: '11_mrng_snacks', label: '11 mrng snacks' },
                  { id: 'noon_lunch', label: 'noon lunch' },
                  { id: 'snacks', label: 'snacks' },
                  { id: 'nyt_dinner', label: 'nyt dinner' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-lg font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shrink-0 ${
                      activeCategory === cat.id 
                        ? 'bg-white text-emerald-600 shadow-sm scale-105' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!user?.isRecipesUnlocked ? (
            /* Locked State: Single beautifully centered Recipe Unlock Card */
            <div className="flex justify-center w-full">
              {/* Card A: Unlock Suggested Recipes (₹99) */}
              <div className="glass-card p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 text-white border-transparent relative overflow-hidden group flex flex-col justify-between min-h-[350px] shadow-2xl max-w-2xl w-full">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                      <Lock className="text-emerald-400" size={28} />
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Suggested Recipes
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-2xl sm:text-3xl font-black tracking-tight">Suggested Recipes Plan</h4>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed">
                      Unlock access to our complete, calorie-calibrated recipe guides configured perfectly for your daily targets. Optimized vegetarian & non-vegetarian protocol.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black">₹99</span>
                      <span className="text-slate-500 font-bold line-through text-base">₹199</span>
                    </div>

                    <button
                      onClick={() => handlePayment(99)}
                      disabled={recipesLoading}
                      className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                    >
                      {recipesLoading ? <Loader2 className="animate-spin" size={16} /> : 'Unlock Recipes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Unlocked State: Disclaimer notice and recipes grid */
            <div className="space-y-8">
              <div className="glass-card p-6 md:p-8 bg-amber-50/50 border-amber-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
                <div className="flex items-start md:items-center gap-5 relative z-10 flex-1">
                  <div className="p-4 bg-amber-100 text-amber-700 rounded-2xl shrink-0 shadow-sm">
                    <Info size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Normal Health Notice</h3>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">
                      These suggested recipes are curated only for individuals with <span className="text-slate-900">no active health issues</span>. If you require a custom diet protocol for specific medical conditions (e.g., High BP, Diabetes, PCOD, etc.), please check out our 1-on-1 Personal Consultancy on the One to One Consultancy tab.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {recipes[activeCategory as keyof typeof recipes]?.map((recipe, i) => (
                  <div key={i} className={`glass-card p-6 flex flex-col justify-between bg-slate-950/70 border-white/10 hover:border-${recipe.isNonVeg ? 'red-500/30' : 'emerald-500/30'} transition-all duration-300 group`}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          {recipe.isNonVeg ? (
                            <div className="w-4 h-4 border-2 border-red-500/50 rounded flex items-center justify-center shrink-0" title="Non-Vegetarian">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 border-2 border-emerald-500/50 rounded flex items-center justify-center shrink-0" title="Vegetarian">
                              <div className="w-1.5 h-1.5 bg-emerald-50 rounded-full" />
                            </div>
                          )}
                          <h4 className="text-lg font-black text-white">{recipe.name}</h4>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border ${recipe.isNonVeg
                          ? 'bg-red-500/15 text-red-300 border-red-500/25'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                          }`}>
                          {recipe.cal}
                        </div>
                      </div>
                      <p className="text-slate-300 font-medium text-sm leading-relaxed mb-6">{recipe.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${recipe.isNonVeg ? 'text-red-400' : 'text-emerald-400'}`}>
                        {recipe.macros}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t-2 border-slate-100">
            {user?.isRecipesUnlocked ? (
              <>
                <PremiumNutritionCard user={user || { name: 'User', email: '', id: '' }} />

                <div className="flex flex-col justify-center p-8 bg-amber-50/50 rounded-3xl border border-amber-100 h-full">
                  <h4 className="text-amber-900 font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> Medical Disclaimer
                  </h4>
                  <p className="text-amber-800/80 font-medium text-sm leading-relaxed">
                    Please consult with a qualified healthcare professional or doctor before starting any new diet, nutrition plan, or drastically changing your eating habits. These recipes are suggestions and may need to be tailored to your specific medical needs and allergies.
                  </p>
                </div>
              </>
            ) : (
              <div className="md:col-span-2 flex flex-col justify-center p-8 bg-amber-50/50 rounded-3xl border border-amber-100 h-full">
                <h4 className="text-amber-900 font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Medical Disclaimer
                </h4>
                <p className="text-amber-800/80 font-medium text-sm leading-relaxed">
                  Please consult with a qualified healthcare professional or doctor before starting any new diet, nutrition plan, or drastically changing your eating habits. These recipes are suggestions and may need to be tailored to your specific medical needs and allergies.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default NutritionDetail;
