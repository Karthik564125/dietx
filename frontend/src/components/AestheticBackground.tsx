import { useEffect, useState } from 'react';
import { Leaf, Sparkles, Heart, Zap, Waves, Activity, TrendingUp } from 'lucide-react';

const AestheticBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-50">
      
      {/* ── 0. MOUSE FOLLOWER GLOW (Desktop Only) ── */}
      {!isMobile && (
        <div 
          className="absolute w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
          }}
        />
      )}

      {/* ── 1. AMBIENT MESH GRADIENTS (Responsive Sizes) ── */}
      <div className="absolute top-[-20%] left-[-10%] w-[100%] md:w-[70%] h-[100%] md:h-[70%] bg-emerald-400/10 md:bg-emerald-400/20 blur-[100px] md:blur-[150px] rounded-full animate-float-slow opacity-40 md:opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[100%] md:w-[60%] h-[100%] md:h-[60%] bg-amber-400/10 md:bg-amber-400/20 blur-[100px] md:blur-[150px] rounded-full animate-float-reverse opacity-40 md:opacity-60" />
      
      {/* ── 2. COMPLEX GLASS SHAPES (Reduced for Mobile) ── */}
      <div className="absolute top-[15%] left-[10%] w-40 md:w-96 h-40 md:h-96 bg-white/10 backdrop-blur-3xl rounded-[2rem] md:rounded-[4rem] rotate-12 border border-white/40 animate-float-slow opacity-30 md:opacity-50" />
      <div className="absolute bottom-[10%] right-[10%] w-64 md:w-[450px] h-64 md:h-[450px] bg-emerald-500/5 backdrop-blur-2xl rounded-full border border-emerald-500/20 animate-float-reverse opacity-20 md:opacity-40" />

      {/* ── 3. FLOATING METRIC MINI-CARDS (Desktop Only) ── */}
      {!isMobile && (
        <>
          <div className="absolute top-[25%] left-[25%] p-6 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-xl animate-float-slow opacity-40">
            <Activity className="text-emerald-500 mb-2" size={24} />
            <div className="w-12 h-1 bg-emerald-500/20 rounded-full" />
          </div>
          <div className="absolute bottom-[30%] right-[30%] p-6 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-xl animate-float opacity-40">
            <TrendingUp className="text-blue-500 mb-2" size={24} />
            <div className="w-12 h-1 bg-blue-500/20 rounded-full" />
          </div>
        </>
      )}

      {/* ── 4. PREMIUM VECTOR ART (Smaller on Mobile) ── */}
      <div className="absolute top-[5%] right-[20%] text-emerald-500 animate-float-slow opacity-10 md:opacity-25">
        <Leaf size={isMobile ? 150 : 300} strokeWidth={0.3} />
      </div>
      <div className="absolute bottom-[25%] left-[-2%] text-amber-500 animate-float opacity-10 md:opacity-20">
        <Sparkles size={isMobile ? 120 : 250} strokeWidth={0.3} />
      </div>

      {/* ── 5. GLOWING PARTICLES (Reduced Count on Mobile) ── */}
      {[...Array(isMobile ? 20 : 50)].map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full blur-[1px] md:blur-[2px] animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * (isMobile ? 4 : 8) + 2}px`,
            height: `${Math.random() * (isMobile ? 4 : 8) + 2}px`,
            opacity: Math.random() * 0.3 + 0.1,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 6 + 3}s`
          }}
        />
      ))}

      {/* ── 6. FLOATING FOOD ASSETS (Responsive Sizing) ── */}
      <div className="absolute top-[10%] left-[2%] text-[60px] md:text-[180px] animate-float-slow opacity-20 md:opacity-40 drop-shadow-xl">🥗</div>
      <div className="absolute top-[60%] right-[-2%] text-[80px] md:text-[200px] animate-float opacity-15 md:opacity-30 drop-shadow-xl">🥑</div>
      <div className="absolute bottom-[5%] left-[5%] text-[70px] md:text-[160px] animate-float-reverse opacity-20 md:opacity-40 drop-shadow-xl">🥦</div>
      
      {/* ── 7. BACKGROUND ARCHITECTURE ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[1200px] h-[1200px] border-[0.5px] border-emerald-500/5 rounded-full animate-spin-slow opacity-20 md:opacity-40" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[1500px] h-[1500px] border-[0.5px] border-slate-500/5 rounded-full animate-spin-slow [animation-direction:reverse] opacity-20 md:opacity-40" />
    </div>
  );
};

export default AestheticBackground;
