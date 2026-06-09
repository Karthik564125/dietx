import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AestheticBackground from '../components/AestheticBackground';
import { ArrowLeft, ArrowRight, Heart, Leaf, Moon, Baby, Pill, Info, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import pcodBg from '../assets/pcod.jpg';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const WHAT_YOU_GET = [
  'Dedicated 1-on-1 session with Dt. Madhavi Latha',
  'Fully personalised diet & nutrition plan',
  'Hormone balance & cycle regulation tips',
  'Tailored exercise & movement protocol',
  'Stress management & sleep optimisation',
  'Monthly progress review call',
];

const HEALTH_PILLARS = [
  {
    icon: <Leaf size={20} className="text-pink-300" />,
    title: 'PCOD / PCOS Reversal',
    desc: 'Root-cause nutrition and lifestyle changes that clinically reverse PCOD/PCOS symptoms — without relying on medication.',
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
    desc: 'Proven protocols using food, movement, and sleep as medicine — so you can manage and reverse PCOD/PCOS without long-term drug dependency.',
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

const infoCardStyle = {
  background: 'rgba(80, 15, 50, 0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(236, 72, 153, 0.45)',
  borderRadius: '1.25rem',
  boxShadow: '0 6px 28px rgba(236,72,153,0.14), 0 2px 12px rgba(0,0,0,0.45)',
};

interface PcodConsultancyProps {
  setIsAuthenticated: (val: boolean) => void;
}

export default function PcodConsultancy({ setIsAuthenticated }: PcodConsultancyProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${API_BASE_URL}/api/health-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser({
          id: res.data.userId || '',
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          isPcodUnlocked: res.data.isPcodUnlocked
        });
      })
      .catch(console.error);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to make a payment');
        return;
      }

      const { data } = await axios.post(
        `${API_BASE_URL}/api/payment/create-order`,
        { amount: 99, planName: 'pcod_consultancy' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = data;

      const options = {
        key: 'rzp_live_SzVEKJaiNjOm1R', // Live Key
        amount: order.amount,
        currency: order.currency,
        name: 'DietX Holistic Wellness',
        description: 'DietX - PCOD/PCOS Consultation',
        order_id: order.id,
        notes: { consultationType: 'PCOD/PCOS' },
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post(
              `${API_BASE_URL}/api/payment/verify`,
              {
                ...response,
                userId: user?.id,
                email: user?.email,
                phone: user?.phone || response.contact,
                amount: 99,
                planName: 'pcod_consultancy'
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success('Payment Successful! Your PCOD Consultation is Booked.');
              setUser((prev: any) => ({ ...prev, isPcodUnlocked: true }));
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
          color: '#db2777',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed', error);
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium flex flex-col relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={pcodBg} />

      <main className="max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center py-14 sm:py-20 animate-in fade-in duration-700">

        {/* Back to Dashboard */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-pink-200 transition-all hover:text-white hover:-translate-x-0.5"
            style={{
              background: 'rgba(236, 72, 153, 0.12)',
              border: '1px solid rgba(236, 72, 153, 0.30)',
            }}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>
        </div>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-20">

          {/* Left – headline */}
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-1 bg-pink-400 rounded-full" />
                <span className="text-[10px] sm:text-xs font-black text-pink-200 uppercase tracking-[0.3em]">
                  Women's Health · PCOD / PCOS Consultancy
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-black tracking-tighter text-white leading-[0.85]">
                PCOD &amp; PCOS <br />
                <span className="text-pink-400">Reversal</span>
              </h1>
              <p className="text-pink-200 font-black uppercase tracking-[0.4em] text-sm sm:text-lg">
                1-on-1 Personal Consultancy
              </p>
            </div>

            <div className="text-base lg:text-lg text-pink-100 leading-relaxed space-y-4 max-w-xl">
              <p>
                There is currently no permanent pharmaceutical "cure" for PCOD/PCOS — but through targeted nutrition, movement, and lifestyle changes, the condition can be put into full{' '}
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

              {user?.isPcodUnlocked ? (
                <>
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      <CheckCircle2 size={12} /> Consultation Unlocked
                    </span>
                    <p className="text-pink-100 text-sm leading-relaxed mt-2">
                      Your PCOD/PCOS consultation is booked! Tap below to start your private session on WhatsApp.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/919100101921?text=Hi%20I%20have%20booked%20the%20PCOD%20Consultation.%20Please%20guide%20me!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm text-center shadow-lg hover:-translate-y-0.5"
                  >
                    Start Chat Now <ArrowRight size={16} />
                  </a>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-white">₹99</span>
                      <span className="text-pink-300 text-sm pb-1">/ Consultation</span>
                    </div>
                    <p className="text-pink-100 text-sm leading-relaxed">
                      Includes a full initial assessment, personalised plan, and a follow-up check-in.
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-pink-100">
                    {['45-min consultation'].map((f) => (
                      <li key={f} className="flex gap-2 items-center">
                        <Heart size={12} className="text-pink-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Book My Session'} <ArrowRight size={16} />
                  </button>
                </>
              )}

              <p className="text-center text-pink-300 text-[10px] uppercase tracking-widest">
                Secure · Confidential · Personalised
              </p>
            </div>
          </div>
        </div>

        {/* ── PCOD → PCOS NAME CHANGE INFO ─────────────────────── */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-1 bg-pink-400 rounded-full" />
            <h2 className="text-xs font-black text-pink-200 uppercase tracking-[0.3em]">
              Important Update · PCOD is now PCOS
            </h2>
          </div>

          <div className="p-8 space-y-6" style={infoCardStyle}>
            <div className="flex items-start gap-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(236, 72, 153, 0.25)', border: '1px solid rgba(236,72,153,0.4)' }}
              >
                <Info size={22} className="text-pink-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Why was PCOS renamed to PMOS?
                </h3>
                <p className="text-pink-100 text-sm leading-relaxed">
                  The medical community has globally shifted from the term{' '}
                  <strong className="text-pink-300">PCOS (Polycystic Ovarian Syndrome)</strong> to{' '}
                  <strong className="text-pink-300">PMOS (Polyendocrine metabolic ovarian syndrome)</strong>. Here's why this matters:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: '"Disease" vs "Syndrome"',
                  desc: 'PCOS implied a singular disease with a specific cause. PMOS better reflects that it is a complex hormonal syndrome — a cluster of symptoms rather than one defined disease.',
                },
                {
                  title: 'Broader Recognition',
                  desc: 'The term PMOS is now internationally adopted (WHO, ESHRE, Endocrine Society) ensuring women worldwide get consistent diagnosis, treatment, and research standards.',
                },
                {
                  title: 'Not All Have Cysts',
                  desc: 'Many women with PMOS do not actually have ovarian cysts detectable by ultrasound. The new term focuses on the hormonal and metabolic picture rather than just structural findings.',
                },
              ].map((point, i) => (
                <div
                  key={i}
                  className="p-5 space-y-3 rounded-xl"
                  style={{
                    background: 'rgba(236, 72, 153, 0.10)',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-pink-400 shrink-0" />
                    <h4 className="text-sm font-black text-pink-200 tracking-tight">{point.title}</h4>
                  </div>
                  <p className="text-pink-100 text-xs leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-pink-200 text-sm text-center leading-relaxed border-t pt-5" style={{ borderColor: 'rgba(236,72,153,0.20)' }}>
              Throughout this page, <strong className="text-pink-300">PCOD and PCOS refer to the same condition</strong>. Both terms are used interchangeably. Our consultancy addresses both terminologies equally.
            </p>
          </div>
        </section>

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

          <div className="p-8 space-y-6" style={infoCardStyle}>
            <p className="text-pink-100 text-sm leading-relaxed max-w-2xl">
              A proven, step-by-step protocol to reverse PCOD/PCOS through holistic lifestyle changes — no crash diets, no medication dependency.
            </p>

            <div className="space-y-4">
              {ROADMAP.map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="flex items-start gap-5 p-5 rounded-xl group transition-all hover:scale-[1.01]"
                  style={{
                    background: 'rgba(236, 72, 153, 0.08)',
                    border: '1px solid rgba(236, 72, 153, 0.20)',
                  }}
                >
                  {/* Step badge */}
                  <div
                    className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-pink-300 tracking-widest"
                    style={{
                      background: 'rgba(236, 72, 153, 0.20)',
                      border: '1px solid rgba(236, 72, 153, 0.35)',
                    }}
                  >
                    {step}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-black text-white tracking-tight group-hover:text-pink-200 transition-colors">
                      {title}
                    </h4>
                    <p className="text-pink-100 text-sm leading-relaxed">{desc}</p>
                  </div>

                  {/* Right accent dot */}
                  <div
                    className="shrink-0 mt-2 w-2 h-2 rounded-full"
                    style={{ background: 'rgba(236, 72, 153, 0.50)' }}
                  />
                </div>
              ))}
            </div>

            <p className="text-pink-200 text-sm text-center pt-4 border-t" style={{ borderColor: 'rgba(236,72,153,0.20)' }}>
              A sustainable, gradual lifestyle shift yields the best long-term results for hormonal health.{' '}
              <strong className="text-pink-300">No crash diets. No dependency. Just results.</strong>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}