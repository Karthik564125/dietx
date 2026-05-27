import { useState } from 'react';
import { CALORIE_REFERENCE_DATA } from '../data/calorieReference';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Flame, Search } from 'lucide-react';

const CalorieReferenceGuide = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState('');

  const activeData = CALORIE_REFERENCE_DATA[activeCategory];
  const filteredItems = activeData.items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card flex flex-col h-full w-full overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-2xl relative shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-white/5 relative z-10">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-500/20">
                 <Info size={24} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white leading-none tracking-tight">Calorie Guide</h2>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1.5">Quick Food Reference</p>
              </div>
           </div>
           
           <div className="relative group/search w-full xl:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/search:text-emerald-400" size={16} />
              <input 
                type="text" 
                placeholder="Search foods..."
                className="w-full bg-black/20 border border-white/10 text-white pl-12 pr-4 py-3 rounded-full outline-none focus:border-emerald-500/50 font-bold placeholder:text-slate-500 text-sm transition-all shadow-inner"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>

        {/* Categories (Horizontal Scroll) */}
        <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-2 -mx-2 px-2">
           {CALORIE_REFERENCE_DATA.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => { setActiveCategory(idx); setSearch(''); }}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === idx ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 scale-105' : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
              >
                {cat.title}
              </button>
           ))}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-3 custom-scrollbar relative z-10" style={{ maxHeight: '600px' }}>
         <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
              <motion.div 
                 key={item.name + idx}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                 className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-white/5 hover:border-emerald-500/30 hover:shadow-lg transition-all gap-4"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors"></div>
                    <div>
                       <h4 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">{item.name}</h4>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 group-hover:text-emerald-500/70 transition-colors">Portion: {item.qty}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2.5 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors self-end sm:self-auto">
                    <Flame size={16} className="text-emerald-500 animate-pulse" />
                    <span className="text-lg font-black text-emerald-400 leading-none">{item.kcal}</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Kcal</span>
                 </div>
              </motion.div>
            )) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500">
                    <Search size={24} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-300">No matching foods</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Try another search term</p>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default CalorieReferenceGuide;
