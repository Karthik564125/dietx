import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MessageCircle, ArrowLeft, Zap, Sparkles, Loader2, CheckCircle2, Clock, Heart, Leaf, UserCheck, ChevronRight } from 'lucide-react';
import AestheticBackground from '../components/AestheticBackground';
import bgDashboard from '../assets/dashboard.jpeg';

interface SessionsProps {
  setIsAuthenticated: (val: boolean) => void;
}

const consultationSteps = [
  {
    num: '01',
    title: 'Detailed Discussion',
    desc: 'We talk about your health concerns, medical history, lifestyle, sleep, stress, eating habits & goals.',
  },
  {
    num: '02',
    title: 'Root Cause Assessment',
    desc: 'I analyse the real cause behind your issues using nutrition, lifestyle, and holistic health principles.',
  },
  {
    num: '03',
    title: 'Personalised Plan Creation',
    desc: 'You will receive a customised diet, lifestyle, and natural healing plan made just for your body.',
  },
  {
    num: '04',
    title: 'Acupressure & Natural Guidance',
    desc: 'I guide you with simple acupressure points, natural remedies, and easy daily practices.',
  },
  {
    num: '05',
    title: 'Mind & Emotional Support',
    desc: 'We work on stress, emotions, mindset & habits for long-term inner healing.',
  },
  {
    num: '06',
    title: 'Next Steps & Handholding',
    desc: 'You will know the exact next steps and how I can support you on your healing journey.',
  },
];

const walkAwayItems = [
  'Clarity about your health & root cause',
  'A personalised healing plan just for you',
  'Practical steps you can start immediately',
  'Guidance for long-term healing & results',
];

const Sessions = ({ setIsAuthenticated }: SessionsProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:5001/api/health-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser({
          id: res.data.userId || '',
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          isPremium: res.data.isPremium,
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
        'http://localhost:5001/api/payment/create-order',
        { amount: 499 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = data;

      const options = {
        key: 'rzp_test_SnyXd605r6Yfse',
        amount: order.amount,
        currency: order.currency,
        name: 'Diet X Personal Consultancy',
        description: '1-2-1 Personal Consultation Session',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post(
              'http://localhost:5001/api/payment/verify',
              {
                ...response,
                userId: user?.id,
                email: user?.email,
                phone: user?.phone || response.contact,
                amount: 499,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success('Payment Successful! Your 1-2-1 Consultation is Booked.');
              setUser((prev: any) => ({ ...prev, isPremium: true }));
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
          color: '#10b981',
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
    <div className="min-h-screen flex flex-col bg-premium relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={bgDashboard} />

      <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-12 py-10 sm:py-16">

        {/* Header */}
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
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
              Sessions & <span className="text-emerald-400">Consultations</span>
            </h1>
            <p className="text-white/60 font-bold text-base sm:text-lg uppercase tracking-widest">1-2-1 with Dt. Madhavi Latha</p>
          </div>
        </header>

        {/* Intro tagline */}
        <div className="glass-card p-6 sm:p-8 border border-white/10 bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] text-center space-y-2 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Personalized. Holistic. <span className="text-emerald-400">Just for You.</span>
          </h2>
          <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl mx-auto">
            A focused 1-on-1 session to understand your body, mind & lifestyle and create the right path for your healing journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12">

          {/* Left: Consultation Details */}
          <div className="flex-1 glass-card p-8 sm:p-10 border border-white/10 space-y-8 flex flex-col shadow-2xl backdrop-blur-2xl bg-slate-900/40 rounded-[2rem]">

            {/* Session Steps */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">What Happens in Your Session</p>
              <div className="space-y-4">
                {consultationSteps.map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <span className="text-[10px] font-black text-emerald-400 tracking-widest">{step.num}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-black text-sm tracking-tight">{step.title}</p>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0">
                <Clock size={18} className="text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Session Duration</p>
                <p className="text-white font-black text-sm">45 – 60 Minutes</p>
                <p className="text-slate-400 text-xs font-medium">A dedicated time for YOU and your transformation.</p>
              </div>
            </div>

            {/* Walk Away With */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">You Walk Away With</p>
              <div className="flex flex-col gap-2.5">
                {walkAwayItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-slate-300 text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
              {[
                { icon: <UserCheck size={15} />, label: 'Personalized Care' },
                { icon: <Leaf size={15} />, label: 'Root Cause Healing' },
                { icon: <Heart size={15} />, label: 'Sustainable Wellness' },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-9 h-9 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    {p.icon}
                  </div>
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-wider leading-tight">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Premium Card or Active Chat */}
          <div className="flex-1 w-full flex flex-col">
            {user?.isPremium ? (
              /* Premium Unlocked State */
              <div className="glass-card p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-8 border-4 border-emerald-400 shadow-2xl h-full bg-slate-900/80 rounded-[2rem]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 text-emerald-400 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/30 shadow-inner relative group animate-bounce">
                  <MessageCircle size={36} className="relative z-10" />
                </div>

                <div className="space-y-2">
                  <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl justify-center">
                    <CheckCircle2 size={12} /> Consultation Unlocked
                  </span>
                  <h3 className="text-2xl font-black text-white mt-4">Talk to Dt. Madhavi Latha</h3>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-sm">
                    Your 1-2-1 consultation is booked! Tap below to start your private session on WhatsApp.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <a
                    href="https://wa.me/919100101921?text=Hi%20I%20have%20booked%20the%201-2-1%20Consultation.%20Please%20guide%20me!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between group bg-emerald-600 text-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-lg sm:text-xl font-black shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                  >
                    Start Chat Now
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all">
                      <MessageCircle size={24} />
                    </div>
                  </a>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    Average response time: &lt; 2 hours
                  </p>
                </div>
              </div>
            ) : (
              /* Locked State */
              <div className="flex flex-col gap-8 h-full">
                {/* Plan Card */}
                <div className="glass-card p-8 sm:p-10 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-transparent relative overflow-hidden group flex flex-col justify-between min-h-[360px] shadow-2xl rounded-[2rem]">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                        <Sparkles className="text-amber-400" size={28} />
                      </div>
                      <div className="bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                        1-2-1 SESSION
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-left">Book Your 1-2-1 Consultation</h4>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed text-left">
                        45–60 min personalised session with Dt. Madhavi Latha — root cause assessment, custom healing plan & natural guidance.
                      </p>

                      {/* Mini feature list */}
                      <div className="flex flex-col gap-2 pt-2">
                        {[
                          'Root Cause Analysis',
                          'Custom Diet & Lifestyle Plan',
                          'Acupressure & Natural Remedies',
                          'Mind & Emotional Support',
                        ].map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-300 font-semibold">
                            <ChevronRight size={13} className="text-emerald-400 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto w-full">
                      <div className="flex items-baseline gap-2 mr-auto">
                        <span className="text-4xl font-black">₹499</span>
                        <span className="text-slate-500 font-bold text-sm">/ session</span>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20"
                      >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Card */}
                <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center space-y-6 border border-white/10 shadow-2xl bg-slate-900/40 rounded-[2rem]">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner border border-emerald-500/20 shrink-0">
                      <MessageCircle size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-white text-sm">Have Questions First?</h4>
                      <p className="text-xs text-slate-400 font-bold">Chat directly with us to clarify your doubts.</p>
                    </div>
                  </div>

                  <div className="w-full">
                    <a
                      href="https://wa.me/919100101921?text=Hi%20I%20want%20to%20know%20more%20about%20the%201-2-1%20Consultation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between group bg-emerald-600 text-white px-6 py-4 rounded-2xl text-base font-black shadow-xl shadow-emerald-600/10 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                    >
                      Start Chat Now
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all">
                        <MessageCircle size={18} />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Quote */}
        <section className="glass-card p-8 mt-8 text-center">
          <p className="text-white/70 font-medium leading-relaxed max-w-2xl mx-auto italic text-base">
            "Let's heal it, together. ♡ — Natural Healing. Real Results. Because you deserve to live fully."
          </p>
          <p className="text-emerald-400 font-black mt-4 uppercase tracking-[0.3em] text-[11px]">DietX Holistic Wellness</p>
        </section>

      </main>
    </div>
  );
};

export default Sessions;