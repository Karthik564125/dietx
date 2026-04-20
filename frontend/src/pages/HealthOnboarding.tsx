import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

type Gender = 'male' | 'female' | 'other' | '';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive' | '';

interface Results {
  bmi: number;
  dailyCalories: number;
  bmiCategory: string;
}

const activityOptions = [
  { value: 'sedentary',  label: 'Sedentary',       desc: 'Little or no exercise',             icon: '🪑' },
  { value: 'light',      label: 'Lightly Active',   desc: 'Light exercise 1–3 days/week',      icon: '🚶' },
  { value: 'moderate',   label: 'Moderately Active', desc: 'Moderate exercise 3–5 days/week',  icon: '🏃' },
  { value: 'active',     label: 'Very Active',       desc: 'Hard exercise 6–7 days/week',      icon: '💪' },
  { value: 'veryActive', label: 'Extra Active',      desc: 'Very hard exercise + physical job', icon: '🏋️' },
];

const foodMap: Record<string, { emoji: string; name: string; tip: string }[]> = {
  Underweight: [
    { emoji: '🥜', name: 'Nuts & Seeds',          tip: 'Almonds, walnuts — calorie-dense healthy snacks' },
    { emoji: '🍌', name: 'Bananas & Dates',        tip: 'Natural sugars for quick energy boost' },
    { emoji: '🥛', name: 'Full-Fat Dairy',         tip: 'Milk, paneer, lassi for protein & healthy fats' },
    { emoji: '🍗', name: 'Lean Proteins',          tip: 'Eggs, chicken, lentils to build muscle' },
    { emoji: '🫓', name: 'Whole Grain Roti + Ghee', tip: 'Complex carbs with healthy calorie density' },
  ],
  Normal: [
    { emoji: '🥗', name: 'Fresh Salads',       tip: 'Mixed veggies with olive oil dressing' },
    { emoji: '🍚', name: 'Brown Rice & Dal',   tip: 'Balanced carbs and plant protein combo' },
    { emoji: '🥦', name: 'Green Vegetables',   tip: 'Broccoli, spinach, beans — nutrient powerhouses' },
    { emoji: '🍎', name: 'Fresh Fruits',       tip: 'Vitamins, antioxidants and natural fiber' },
    { emoji: '🥚', name: 'Eggs & Pulses',      tip: 'Quality protein to maintain lean muscle' },
  ],
  Overweight: [
    { emoji: '🥦', name: 'Leafy Greens',    tip: 'Low calorie & high fiber — keeps you full longer' },
    { emoji: '🫘', name: 'Sprouts & Moong', tip: 'High protein, very low in calories' },
    { emoji: '🥒', name: 'Raw Vegetables',  tip: 'Cucumber, carrot — perfect guilt-free snacks' },
    { emoji: '🫖', name: 'Green Tea',        tip: 'Boosts metabolism & naturally reduces appetite' },
    { emoji: '🥣', name: 'Oats & Poha',     tip: 'Light, filling breakfast with good fiber' },
  ],
  Obese: [
    { emoji: '🥬', name: 'Dark Leafy Greens',        tip: 'Spinach, methi — max nutrition, minimal calories' },
    { emoji: '🥒', name: 'High-Water Vegetables',    tip: 'Cucumber, bottle gourd for hydration & fullness' },
    { emoji: '🫘', name: 'Lentils & Sprouts',        tip: 'Plant protein with a low glycemic index' },
    { emoji: '🫖', name: 'Chaas / Buttermilk',       tip: 'Probiotic, cooling and very low calorie' },
    { emoji: '🍋', name: 'Warm Lemon Water (AM)',     tip: 'Kick-starts metabolism every morning' },
  ],
};

const bmiColor = (cat: string) =>
  ({ Underweight: '#3b82f6', Normal: '#10b981', Overweight: '#f59e0b', Obese: '#ef4444' }[cat] ?? '#64748b');

const bmiPercent = (bmi: number) => Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);

export default function HealthOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [useImperial, setUseImperial] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Results | null>(null);

  // Form state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('0');
  const [weightKg, setWeightKg] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('');

  useEffect(() => {
    // Detect country via IP to set default unit system
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { if (['US', 'LR', 'MM'].includes(d.country_code)) setUseImperial(true); })
      .catch(() => {});
  }, []);

  const validate = () => {
    setError('');
    if (step === 1) {
      if (!age || +age < 10 || +age > 120) { setError('Enter a valid age (10–120).'); return false; }
      if (!gender) { setError('Please select your gender.'); return false; }
    }
    if (step === 2) {
      if (useImperial) {
        if (!heightFt || +heightFt < 3 || +heightFt > 8) { setError('Enter a valid height (3–8 ft).'); return false; }
        if (!weightLbs || +weightLbs < 50 || +weightLbs > 800) { setError('Enter a valid weight in lbs.'); return false; }
      } else {
        if (!heightCm || +heightCm < 100 || +heightCm > 250) { setError('Enter a valid height (100–250 cm).'); return false; }
        if (!weightKg || +weightKg < 20 || +weightKg > 400) { setError('Enter a valid weight in kg.'); return false; }
      }
    }
    if (step === 3 && !activity) { setError('Please select your activity level.'); return false; }
    return true;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload: Record<string, unknown> = { age, gender, activityLevel: activity,
        heightUnit: useImperial ? 'ft_in' : 'cm',
        weightUnit: useImperial ? 'lbs' : 'kg',
      };
      if (useImperial) { payload.feet = heightFt; payload.inches = heightIn; payload.weight = weightLbs; }
      else { payload.height = heightCm; payload.weight = weightKg; }

      const res = await axios.post('http://localhost:5001/api/health-profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...stored, profileComplete: true,
        bmi: res.data.bmi, dailyCalories: res.data.dailyCalories, bmiCategory: res.data.bmiCategory,
      }));
      setResults(res.data);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error ?? 'Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  };

  /* ── RESULTS SCREEN ── */
  if (results) {
    const foods = foodMap[results.bmiCategory] ?? foodMap['Normal'];
    const color = bmiColor(results.bmiCategory);
    const pct   = bmiPercent(results.bmi);

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f5f3ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Diet<span style={{ color: '#059669' }}>X</span>
            </span>
          </div>

          <div style={{ background: '#fff', borderRadius: 28, boxShadow: '0 8px 48px rgba(0,0,0,.09)', border: '1px solid #e2e8f0', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>🎉</div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Your Health Profile is Ready!</h1>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>Here's your personalised nutrition overview</p>
            </div>

            {/* BMI Card */}
            <div style={{ background: '#f8fafc', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>Body Mass Index (BMI)</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 52, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{results.bmi}</p>
                  <span style={{ display: 'inline-block', marginTop: 10, padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, background: color + '22', color }}>
                    {results.bmiCategory}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'right', lineHeight: 1.7 }}>
                  <div>&lt;18.5 Underweight</div>
                  <div>18.5–24.9 Normal</div>
                  <div>25–29.9 Overweight</div>
                  <div>30+ Obese</div>
                </div>
              </div>
              {/* BMI Scale bar */}
              <div style={{ marginTop: 18, position: 'relative', height: 10, borderRadius: 6, background: 'linear-gradient(to right,#3b82f6 0%,#10b981 30%,#f59e0b 65%,#ef4444 100%)' }}>
                <div style={{ position: 'absolute', top: -3, left: `${pct}%`, transform: 'translateX(-50%)', width: 16, height: 16, background: '#fff', border: '3px solid #0f172a', borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }} />
              </div>
            </div>

            {/* Calories Card */}
            <div style={{ borderRadius: 20, padding: 24, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff' }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b' }}>Daily Calorie Target</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 52, fontWeight: 900 }}>{results.dailyCalories.toLocaleString()}</span>
                <span style={{ fontSize: 17, color: '#94a3b8', fontWeight: 600 }}>kcal / day</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#475569' }}>Mifflin–St Jeor equation · adjusted for your activity level</p>
            </div>

            {/* Food Recommendations */}
            <div>
              <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>Recommended Foods</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {foods.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 16px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 26 }}>{f.emoji}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{f.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{f.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              style={{ width: '100%', padding: '16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.2px' }}
            >
              Go to My Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── WIZARD STEPS ── */
  const stepLabels = ['Personal', 'Body', 'Activity'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f5f3ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ maxWidth: 520, width: '100%' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Diet<span style={{ color: '#059669' }}>X</span>
          </span>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Let's set up your health profile</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 28, boxShadow: '0 8px 48px rgba(0,0,0,.09)', border: '1px solid #e2e8f0', padding: '36px 32px' }}>
          
          {/* Exit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
            <button 
              onClick={() => navigate(location.state?.from || '/dashboard')}
              style={{ 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                color: '#64748b', 
                fontSize: 11, 
                fontWeight: 800, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6, 
                padding: '8px 16px',
                borderRadius: '12px',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#64748b';
              }}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               Back
            </button>
          </div>

          {/* Step Progress */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
            {/* track bg */}
            <div style={{ position: 'absolute', top: 15, left: '12.5%', right: '12.5%', height: 3, background: '#e2e8f0', borderRadius: 2, zIndex: 0 }}>
              <div style={{ height: '100%', borderRadius: 2, background: '#059669', transition: 'width .4s ease', width: `${((step - 1) / 2) * 100}%` }} />
            </div>
            {stepLabels.map((lbl, i) => {
              const s = i + 1;
              const done = s < step; const active = s === step;
              return (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, background: '#fff', paddingInline: 4 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: `2.5px solid ${done ? '#059669' : active ? '#0f172a' : '#e2e8f0'}`, background: done ? '#059669' : active ? '#0f172a' : '#fff', color: done || active ? '#fff' : '#94a3b8', transition: 'all .3s' }}>
                    {done ? '✓' : s}
                  </div>
                  <span style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: active ? '#0f172a' : '#94a3b8' }}>{lbl}</span>
                </div>
              );
            })}
          </div>

          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Step {step} of 3</p>
          <h2 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
            {['Personal Info', 'Your Measurements', 'Activity Level'][step - 1]}
          </h2>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={labelStyle}>How old are you?</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" placeholder="e.g. 28" min={10} max={120} value={age} onChange={e => setAge(e.target.value)} style={inputStyle} />
                  <span style={unitBadge}>yrs</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Your gender</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {([['male','👨','Male'],['female','👩','Female'],['other','🧑','Other']] as [Gender,string,string][]).map(([v,em,lbl]) => (
                    <button key={v} onClick={() => setGender(v)} style={{ padding: '16px 8px', borderRadius: 16, border: `2px solid ${gender === v ? '#0f172a' : '#e2e8f0'}`, background: gender === v ? '#0f172a' : '#fff', color: gender === v ? '#fff' : '#0f172a', cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all .2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 26 }}>{em}</span>{lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Unit system toggle */}
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
                {[['Metric (cm / kg)', false], ['Imperial (ft / lbs)', true]].map(([lbl, val]) => (
                  <button key={String(val)} onClick={() => setUseImperial(val as boolean)} style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: useImperial === val ? '#fff' : 'transparent', color: useImperial === val ? '#0f172a' : '#64748b', boxShadow: useImperial === val ? '0 1px 4px rgba(0,0,0,.1)' : 'none', transition: 'all .2s' }}>
                    {lbl as string}
                  </button>
                ))}
              </div>

              {/* Height */}
              <div>
                <label style={labelStyle}>Height</label>
                {useImperial ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                      <input type="number" placeholder="5" value={heightFt} onChange={e => setHeightFt(e.target.value)} style={inputStyle} min={3} max={8} />
                      <span style={unitBadge}>ft</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input type="number" placeholder="10" value={heightIn} onChange={e => setHeightIn(e.target.value)} style={inputStyle} min={0} max={11} />
                      <span style={unitBadge}>in</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="170" value={heightCm} onChange={e => setHeightCm(e.target.value)} style={inputStyle} min={100} max={250} />
                    <span style={unitBadge}>cm</span>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div>
                <label style={labelStyle}>Weight</label>
                {useImperial ? (
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="150" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} style={inputStyle} min={50} max={800} />
                    <span style={unitBadge}>lbs</span>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="70" value={weightKg} onChange={e => setWeightKg(e.target.value)} style={inputStyle} min={20} max={400} />
                    <span style={unitBadge}>kg</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activityOptions.map(opt => {
                const active = activity === opt.value;
                return (
                  <button key={opt.value} onClick={() => setActivity(opt.value as ActivityLevel)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 16, border: `2px solid ${active ? '#0f172a' : '#e2e8f0'}`, background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#0f172a', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}>
                    <span style={{ fontSize: 26 }}>{opt.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{opt.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: active ? '#94a3b8' : '#64748b' }}>{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginTop: 16, padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, color: '#dc2626', fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}

          {/* Nav Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '2px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: submitting ? '#6ee7b7' : '#059669', color: '#fff', fontWeight: 700, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background .2s' }}>
                {submitting ? 'Calculating…' : '🔢 Calculate My BMI'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── shared micro-styles ── */
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 48px 13px 16px', border: '2px solid #e2e8f0', borderRadius: 14,
  fontSize: 16, fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', background: '#fff', transition: 'border-color .2s',
};
const unitBadge: React.CSSProperties = {
  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
  fontSize: 12, fontWeight: 700, color: '#94a3b8',
};
