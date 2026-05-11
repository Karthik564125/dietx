import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PremiumNutritionCard from '../components/PremiumNutritionCard';
import axios from 'axios';
import { ArrowLeft, Salad, Flame, PieChart, Info, ChevronRight } from 'lucide-react';

interface NutritionDetailProps {
  setIsAuthenticated: (val: boolean) => void;
}

const NutritionDetail = ({ setIsAuthenticated }: NutritionDetailProps) => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeDiet, setActiveDiet] = useState<'veg'|'nonVeg'>('veg');

  const recipes = {
    veg: [
      { name: 'Paneer Tikka Salad', macros: 'P: 22g | C: 12g | F: 18g', desc: 'Grilled cottage cheese with fresh greens and mint chutney dressing.', cal: '320 kcal' },
      { name: 'Quinoa & Black Bean Bowl', macros: 'P: 18g | C: 45g | F: 10g', desc: 'Protein-packed quinoa with spiced black beans, corn, and avocado.', cal: '410 kcal' },
      { name: 'Oats & Veggie Chilla', macros: 'P: 15g | C: 35g | F: 8g', desc: 'Savory Indian pancakes made with oats, besan, and mixed vegetables.', cal: '280 kcal' },
      { name: 'Lentil (Dal) Power Soup', macros: 'P: 20g | C: 40g | F: 5g', desc: 'Comforting yellow dal tempered with ghee, cumin, and garlic.', cal: '350 kcal' },
      { name: 'Greek Yogurt & Berries', macros: 'P: 15g | C: 20g | F: 4g', desc: 'High-protein yogurt topped with fresh mixed berries and chia seeds.', cal: '180 kcal' },
      { name: 'Tofu Stir-fry', macros: 'P: 24g | C: 15g | F: 14g', desc: 'Firm tofu tossed with bell peppers, broccoli, and a light soy-ginger glaze.', cal: '310 kcal' },
    ],
    nonVeg: [
      { name: 'Grilled Lemon Herb Chicken', macros: 'P: 45g | C: 5g | F: 12g', desc: 'Lean chicken breast marinated in herbs, served with steamed broccoli.', cal: '340 kcal' },
      { name: 'Baked Salmon with Asparagus', macros: 'P: 35g | C: 8g | F: 22g', desc: 'Rich in Omega-3s, baked to perfection with a light lemon drizzle.', cal: '420 kcal' },
      { name: 'Turkey Meatballs & Zoodles', macros: 'P: 30g | C: 15g | F: 14g', desc: 'Healthy alternative to pasta using zucchini noodles and lean turkey.', cal: '360 kcal' },
      { name: 'Egg White Veggie Omelette', macros: 'P: 24g | C: 5g | F: 8g', desc: '4 egg whites + 1 whole egg packed with spinach, mushrooms, and peppers.', cal: '210 kcal' },
      { name: 'Tuna Salad Lettuce Wraps', macros: 'P: 28g | C: 4g | F: 10g', desc: 'Light tuna mixed with Greek yogurt, served in crisp romaine leaves.', cal: '250 kcal' },
      { name: 'Chicken & Sweet Potato Mash', macros: 'P: 38g | C: 35g | F: 9g', desc: 'Shredded chicken breast with roasted sweet potatoes and green beans.', cal: '450 kcal' },
    ]
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:5001/api/health-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setHealth(res.data.health);
        setUser({
          id: res.data.userId || '', 
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          isPremium: res.data.isPremium
        });

      })
      .catch(console.error);
  }, []);

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
              Nutrition <span className="text-emerald-600">Strategy</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg sm:text-xl uppercase tracking-widest">Personalized Fuel Protocol</p>
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <Salad className="text-emerald-600" size={32} />
                  Suggested Recipes
                </h2>
                
                {/* Veg/Non-Veg Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button 
                      onClick={() => setActiveDiet('veg')}
                      className={`px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeDiet === 'veg' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Vegetarian
                    </button>
                    <button 
                      onClick={() => setActiveDiet('nonVeg')}
                      className={`px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeDiet === 'nonVeg' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Non-Vegetarian
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {recipes[activeDiet].map((recipe, i) => (
                    <div key={i} className={`glass-card p-6 flex flex-col justify-between border-transparent hover:border-${activeDiet === 'veg' ? 'emerald' : 'red'}-100 transition-all group`}>
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-black text-slate-900">{recipe.name}</h4>
                                <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                    {recipe.cal}
                                </div>
                            </div>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">{recipe.desc}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${activeDiet === 'veg' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {recipe.macros}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t-2 border-slate-100">
                <PremiumNutritionCard user={user || { name: 'User', email: '', id: '' }} />
                
                <div className="flex flex-col justify-center p-8 bg-amber-50/50 rounded-3xl border border-amber-100 h-full">
                    <h4 className="text-amber-900 font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="text-xl">⚠️</span> Medical Disclaimer
                    </h4>
                    <p className="text-amber-800/80 font-medium text-sm leading-relaxed">
                        Please consult with a qualified healthcare professional or doctor before starting any new diet, nutrition plan, or drastically changing your eating habits. These recipes are suggestions and may need to be tailored to your specific medical needs and allergies.
                    </p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default NutritionDetail;
