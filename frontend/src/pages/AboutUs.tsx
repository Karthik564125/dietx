import React from 'react';
import Navbar from '../components/Navbar';
import AestheticBackground from '../components/AestheticBackground';
import bgAbout from '../assets/aboutus.jpeg';

interface AboutUsProps {
  setIsAuthenticated: (val: boolean) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ setIsAuthenticated }) => {
  return (
    <div className="min-h-screen bg-premium flex flex-col relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={bgAbout} />

      <main className="max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center py-12 sm:py-20 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Bio */}
          <section className="space-y-6 lg:space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-1 bg-emerald-400 rounded-full"></div>
                 <span className="text-[10px] sm:text-xs font-black text-white/70 uppercase tracking-[0.3em]">The Visionary</span>
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-black tracking-tighter text-white leading-[0.85]">
                Dt. Madhavi <br />
                <span className="text-emerald-400">Latha</span>
              </h1>
              <p className="text-white/70 font-black uppercase tracking-[0.4em] text-sm sm:text-xl">
                 Clinical Dietitian &amp; Holistic Coach
              </p>
            </div>

            <div className="text-base lg:text-xl text-white/80 leading-relaxed font-bold space-y-6 max-w-xl">
              <p>
                Certified from Amity University, I believe that healing begins in the kitchen. I focus on natural and sustainable methods for better health.
              </p>
              <p className="border-l-4 border-emerald-400/50 pl-6 italic text-white/70">
                "My expertise lies in creating personalized nutrition plans that focus on long-term results rather than quick fixes, fitting seamlessly into your life."
              </p>
            </div>
          </section>

          {/* Right Side: focus and contact */}
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <div className="glass-card p-8 lg:p-10 space-y-6">
                <h2 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/15 pb-4">Key Focus Areas</h2>
                <ul className="space-y-4">
                  {[
                    "Sustainable weight loss",
                    "PCOD / PCOS Management",
                    "Gut health & Wellness",
                    "Diabetes management"
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-center text-sm font-black text-white/90 group">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:scale-125 transition-transform" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-8 lg:p-10 space-y-6">
                <h2 className="text-xs font-black text-emerald-300 uppercase tracking-widest italic">"Heal Holistic Way"</h2>
                <p className="text-sm sm:text-base text-white/80 font-bold leading-relaxed">
                  I consider lifestyle, habits, and stress levels while designing plans, incorporating simple naturopathy techniques for total rejuvenation.
                </p>
              </div>
            </div>

            {/* Closing / Contact info */}
            <div className="glass-card p-10 lg:p-12 space-y-10">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Get in Touch</h3>
                  <p className="text-white/60 font-bold text-sm">Direct channels for consultations and queries.</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  <a
                    href="tel:+919100101921"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 hover:border-emerald-400/50 hover:bg-white/20 transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-hover:text-emerald-400 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.52A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" /></svg>
                    </div>
                    <span className="font-black text-white text-sm tracking-tight">+91 91001 01921</span>
                  </a>

                  <a
                    href="https://www.instagram.com/dietitianmadhavi_?igsh=cG5henF1M2pocDg2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 hover:border-pink-400/50 hover:bg-white/20 transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-hover:text-pink-400 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    <span className="font-black text-white text-sm tracking-tight">@dietitianmadhavi_</span>
                  </a>

                  <a
                    href="mailto:nutriwithdietex@gmail.com"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 hover:border-blue-400/50 hover:bg-white/20 transition-all group sm:col-span-2 lg:col-span-1 xl:col-span-2"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-hover:text-blue-400 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <span className="font-black text-white text-sm tracking-tight">nutriwithdietex@gmail.com</span>
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
