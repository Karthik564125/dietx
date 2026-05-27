import Navbar from '../components/Navbar';
import AestheticBackground from '../components/AestheticBackground';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import pcodBg from '../assets/pcod.jpeg'; // PCOD background image

export default function PcodConsultancy() {
  return (
    <div className="min-h-screen bg-premium flex flex-col relative overflow-hidden">
      <Navbar setIsAuthenticated={() => {}} />
      {/* Background image – replace with specific PCOD image later */}
      <AestheticBackground bgImage={pcodBg} />

      <main className="max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center py-12 sm:py-20 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side – description */}
          <section className="space-y-6 lg:space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-1 bg-pink-400 rounded-full"></div>
                <span className="text-[10px] sm:text-xs font-black text-pink-200/70 uppercase tracking-[0.3em]">PCOD Consultancy</span>
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-black tracking-tighter text-pink-100 leading-[0.85]">
                PCOD <br />
                <span className="text-pink-400">Reversal</span>
              </h1>
              <p className="text-pink-100/70 font-black uppercase tracking-[0.4em] text-sm sm:text-xl">
                Personalized plan for PCOD management
              </p>
            </div>
            <div className="text-base lg:text-xl text-pink-200/80 leading-relaxed font-bold space-y-6 max-w-xl">
              <div className="space-y-4">
                <p className="text-pink-200/80 text-base lg:text-xl">
                  While there is currently no permanent "cure" for Polycystic Ovary Syndrome (PCOS) or Polycystic Ovarian Disease (PCOD), the term "reversing" is often used to describe putting the condition into clinical remission.
                </p>
                <p className="text-pink-200/80 text-base lg:text-xl">
                  By addressing the root drivers—primarily insulin resistance, chronic inflammation, and hormonal imbalances—you can drastically reduce or completely eliminate symptoms like irregular periods, weight gain, acne, and hair loss.
                </p>
                <h2 className="text-pink-100 font-black uppercase text-lg mt-4">Roadmap</h2>
                <ol className="list-decimal list-inside text-pink-200/80 space-y-2">
                  <li><strong>Dietary Management (The Foundation)</strong> – Focus on low‑glycemic foods, lean proteins, healthy fats, high fiber, and reduce inflammatory foods.</li>
                  <li><strong>Strategic Exercise & Physical Activity</strong> – Combine strength training and cardio (LISS or HIIT) consistently 30–45 minutes daily.</li>
                  <li><strong>Stress Management & Cortisol Control</strong> – Prioritize 7–8 hours of sleep and daily de‑stressors like meditation, yoga, or nature walks.</li>
                  <li><strong>Targeted Supplements (Under Guidance)</strong> – Inositol (Myo‑ & D‑Chiro 40:1), Omega‑3, Vitamin D3 & Magnesium, Spearmint tea.</li>
                  <li><strong>Medical Management</strong> – Consider insulin sensitizers (Metformin), hormonal regulation (OCP or progesterone), and anti‑androgens if needed.</li>
                </ol>
                <p className="text-pink-200/80 mt-4">
                  A sustainable, gradual lifestyle shift yields the best long‑term results for hormonal health.
                </p>
              </div>
            </div>
          </section>

          {/* Right side – cards */}
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <div className="glass-card p-8 lg:p-10 space-y-6">
                <h2 className="text-xs font-black text-pink-100 uppercase tracking-widest border-b border-pink-200/15 pb-4">
                  What You'll Get
                </h2>
                <ul className="space-y-4">
                  {[
                    'Personalized diet plan',
                    'Lifestyle & stress management',
                    'Hormone balance tips',
                    'Exercise recommendations',
                    'Monthly progress review'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-center text-sm font-black text-pink-100/90 group">
                      <div className="w-2 h-2 bg-pink-400 rounded-full group-hover:scale-125 transition-transform" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-8 lg:p-10 space-y-6">
                <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest italic">
                  Premium PCOD Consultancy
                </h2>
                <p className="text-sm sm:text-base text-pink-200/80 font-bold leading-relaxed">
                  One‑time payment of <span className="text-2xl font-bold">₹299</span> grants full access to a personalized PCOD reversal plan.
                </p>
                <button
                  onClick={() => toast.error('Payment flow coming soon!', { icon: '💳' })}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-pink-50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Buy Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

