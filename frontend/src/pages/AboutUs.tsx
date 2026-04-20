import React from 'react';
import Navbar from '../components/Navbar';

interface AboutUsProps {
  setIsAuthenticated: (val: boolean) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ setIsAuthenticated }) => {
  return (
    <div className="h-screen h-[100dvh] bg-premium overflow-hidden flex flex-col">
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <main className="max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center py-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side: Bio */}
          <section className="space-y-4 lg:space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">About the Founder</span>
              <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-none">
                Dt. Madhavi Latha <br />
                <span className="text-slate-400 font-medium italic text-2xl lg:text-5xl">Clinical Dietitian</span>
              </h1>
            </div>

            <div className="text-sm sm:text-base lg:text-xl text-slate-600 leading-relaxed font-medium space-y-4 max-w-xl">
              <p>
                Certified from Amity University, I believe that healing begins in the kitchen. I focus on natural and sustainable methods for better health.
              </p>
              <p className="hidden sm:block">
                My expertise lies in creating personalized nutrition plans that focus on long-term results rather than quick fixes, fitting seamlessly into your life.
              </p>
            </div>
          </section>

          {/* Right Side: focus and contact */}
          <div className="space-y-4 lg:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="glass-card p-4 lg:p-8 space-y-3">
                <h2 className="text-sm lg:text-xl font-bold text-slate-900 border-b border-white/20 pb-2">Key Focus Areas</h2>
                <ul className="space-y-2">
                  {[
                    "Sustainable weight loss",
                    "PCOD / PCOS Management",
                    "Gut health & Wellness",
                    "Diabetes management"
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-center text-[10px] lg:text-sm font-bold text-slate-700">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-4 lg:p-8 space-y-3">
                <h2 className="text-sm lg:text-xl font-bold text-slate-900 italic">"Heal Holistic Way"</h2>
                <p className="text-[10px] lg:text-sm text-slate-500 font-medium leading-tight">
                  I consider lifestyle, habits, and stress levels while designing plans, incorporating simple naturopathy techniques.
                </p>
              </div>
            </div>

            {/* Closing / Contact info */}
            <div className="glass-card p-4 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
               <p className="text-xs lg:text-lg font-bold text-slate-900 italic max-w-xs text-center sm:text-left">
                "Empowering you to take control of your health confidently."
              </p>
              <div className="flex flex-col gap-2 shrink-0">
                <a
                  href="tel:+919100101921"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs lg:text-sm hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.52A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
                  </svg>
                  +91 91001 01921
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
