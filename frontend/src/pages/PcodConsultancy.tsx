import Navbar from '../components/Navbar';
import AestheticBackground from '../components/AestheticBackground';
import { ArrowRight, Heart, Leaf, Activity, Moon, Baby, Pill } from 'lucide-react';
import toast from 'react-hot-toast';
import pcodBg from '../assets/pcod.jpeg';

const WHAT_YOU_GET = [
  'Dedicated 1-on-1 session with Dt. Madhavi Latha',
  'Fully personalised diet & nutrition plan',
  'Hormone balance & cycle regulation tips',
  'Tailored exercise & movement protocol',
  'Stress management & sleep optimisation',
  'Targeted supplement guidance (no prescriptions)',
  'Monthly progress review call',
];

const HEALTH_PILLARS = [
  {
    icon: <Leaf size={20} className="text-pink-300" />,
    title: 'PCOD Reversal',
    desc: 'Root-cause nutrition and lifestyle changes that clinically reverse PCOD symptoms — without relying on medication.',
  },
  {
    icon: <Moon size={20} className="text-pink-300" />,
    title: 'Menopause Management',
    desc: 'Dietary and lifestyle strategies that ease hot flashes, mood swings, and weight gain during perimenopause and menopause.',
  },
  {
    icon: <Baby size={20} className="text-pink-300" />,
    title: 'Infertility Support',
    desc: 'Addressing PCOD-linked infertility through hormonal balance, insulin sensitivity, and targeted nutrition — naturally.',
  },
  {
    icon: <Pill size={20} className="text-pink-300" />,
    title: 'Medicine-Free Reversal',
    desc: 'Proven protocols using food, movement, and sleep as medicine — so you can manage and reverse PCOD without long-term drug dependency.',
  },
];

const ROADMAP = [
  {
    step: '01',
    title: 'Dietary Reset (Foundation)',
    desc: 'Low-GI foods, lean proteins, anti-inflammatory fats, and fibre-first meals that stabilise insulin and reduce androgens.',
  },
  {
    step: '02',
    title: 'Strategic Movement',
    desc: 'Strength training + LISS/HIIT combo for 30–45 min daily to improve insulin sensitivity and support healthy weight.',
  },
  {
    step: '03',
    title: 'Cortisol & Sleep Protocol',
    desc: '7–8 hours quality sleep, daily mindfulness, and stress-reduction routines to lower cortisol-driven flare-ups.',
  },
  {
    step: '04',
    title: 'Targeted Supplements',
    desc: 'Myo-Inositol + D-Chiro (40:1), Omega-3, Vitamin D3, Magnesium, and Spearmint tea — guided, not guessed.',
  },
  {
    step: '05',
    title: 'Cycle & Hormone Tracking',
    desc: 'Monitor menstrual regularity, AMH, LH/FSH ratios, and metabolic markers to gauge reversal progress monthly.',
  },
];

const cardStyle = {
  background: 'rgba(25, 6, 25, 0.82)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(236, 72, 153, 0.30)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.05)',
};

const accentCardStyle = {
  background: 'rgba(70, 8, 45, 0.88)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(236, 72, 153, 0.50)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 40px rgba(236,72,153,0.18), 0 4px 16px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.05)',
};

export default function PcodConsultancy() {
  return (
    <div className="min-h-screen bg-premium flex flex-col relative overflow-hidden">
      <Navbar setIsAuthenticated={() => { }} />
      <AestheticBackground bgImage={pcodBg} />

      <main className="max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center py-14 sm:py-20 animate-in fade-in duration-700">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-20">

          {/* Left – headline */}
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-1 bg-pink-400 rounded-full" />
                <span className="text-[10px] sm:text-xs font-black text-pink-200 uppercase tracking-[0.3em]">
                  Women's Health · PCOD Consultancy
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-black tracking-tighter text-white leading-[0.85]">
                PCOD <br />
                <span className="text-pink-400">Reversal</span>
              </h1>
              <p className="text-pink-200 font-black uppercase tracking-[0.4em] text-sm sm:text-lg">
                1-on-1 Personal Consultancy
              </p>
            </div>

            <div className="text-base lg:text-lg text-pink-100 leading-relaxed space-y-4 max-w-xl">
              <p>
                There is currently no permanent pharmaceutical "cure" for PCOD — but through targeted nutrition, movement, and lifestyle changes, the condition can be put into full{' '}
                <strong className="text-pink-300">clinical remission</strong>.
              </p>
              <p>
                By addressing the root drivers — insulin resistance, chronic inflammation, and hormonal imbalance — symptoms like irregular periods, weight gain, acne, hair loss, and fertility challenges can be drastically reduced or completely resolved,{' '}
                <strong className="text-pink-300">without lifelong medication</strong>.
              </p>
            </div>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-3">
              {['Menopause Care', 'Infertility Support', 'Medicine-Free', 'Hormonal Health'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-pink-100"
                  style={{
                    background: 'rgba(236, 72, 153, 0.20)',
                    border: '1px solid rgba(236, 72, 153, 0.40)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Right – booking cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* What you get */}
            <div className="p-8 space-y-5" style={cardStyle}>
              <h2
                className="text-xs font-black text-pink-200 uppercase tracking-widest pb-4"
                style={{ borderBottom: '1px solid rgba(236,72,153,0.25)' }}
              >
                What You'll Get
              </h2>
              <ul className="space-y-3">
                {WHAT_YOU_GET.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm font-semibold text-white group">
                    <div className="mt-1.5 w-2 h-2 shrink-0 bg-pink-400 rounded-full group-hover:scale-125 transition-transform" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Book now */}
            <div className="p-8 space-y-6" style={accentCardStyle}>
              <div className="space-y-1">
                <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest italic">
                  1-on-1 Consultancy
                </h2>
                <p className="text-pink-200 text-xs">with Dt. Madhavi Latha</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">₹499</span>
                  <span className="text-pink-300 text-sm pb-1">/ session</span>
                </div>
                <p className="text-pink-100 text-sm leading-relaxed">
                  Includes a full initial assessment, personalised plan, and a follow-up check-in.
                </p>
              </div>

              <ul className="space-y-2 text-sm text-pink-100">
                {['45-min video consultation', 'WhatsApp support for 7 days', 'Custom PDF plan delivered'].map((f) => (
                  <li key={f} className="flex gap-2 items-center">
                    <Heart size={12} className="text-pink-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => toast.error('Booking flow coming soon!', { icon: '📅' })}
                className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Book My Session <ArrowRight size={16} />
              </button>

              <p className="text-center text-pink-300 text-[10px] uppercase tracking-widest">
                Secure · Confidential · Personalised
              </p>
            </div>
          </div>
        </div>

        {/* ── HEALTH PILLARS ───────────────────────────────────── */}
        <section className="mb-20 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-1 bg-pink-400 rounded-full" />
            <h2 className="text-xs font-black text-pink-200 uppercase tracking-[0.3em]">
              Conditions We Address
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HEALTH_PILLARS.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-7 space-y-4 transition-all hover:scale-[1.02]"
                style={{
                  ...cardStyle,
                  border: '1px solid rgba(236, 72, 153, 0.35)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(236, 72, 153, 0.20)' }}
                >
                  {icon}
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
                <p className="text-pink-100 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ROADMAP ──────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-1 bg-pink-400 rounded-full" />
            <h2 className="text-xs font-black text-pink-200 uppercase tracking-[0.3em]">
              The Reversal Roadmap
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {ROADMAP.map(({ step, title, desc }) => (
              <div
                key={step}
                className="p-6 space-y-3 relative overflow-hidden transition-all hover:scale-[1.02]"
                style={cardStyle}
              >
                <span
                  className="absolute -top-3 -right-2 text-[4rem] font-black leading-none select-none"
                  style={{ color: 'rgba(236,72,153,0.12)' }}
                >
                  {step}
                </span>
                <p className="text-pink-400 text-xs font-black tracking-widest">{step}</p>
                <h3 className="text-sm font-black text-white">{title}</h3>
                <p className="text-pink-100 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <p className="text-pink-200 text-sm text-center pt-4 max-w-xl mx-auto">
            A sustainable, gradual lifestyle shift yields the best long-term results for hormonal health.{' '}
            <strong className="text-pink-300">No crash diets. No dependency. Just results.</strong>
          </p>
        </section>

      </main>
    </div>
  );
}