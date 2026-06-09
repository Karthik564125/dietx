import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft, Phone } from 'lucide-react';

import logo from '../assets/logo.png';
import AestheticBackground from '../components/AestheticBackground';
import bgLanding from '../assets/landingpage.jpg';
import { API_BASE_URL } from '../config';




interface AuthPageProps {
  setAuth: (val: boolean) => void;
}

const AuthPage = ({ setAuth }: AuthPageProps) => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', gender: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Profile picture
  // Profile picture state removed

  useEffect(() => {
    if (location.state?.mode) {
      setIsLogin(location.state.mode === 'login');
    }
  }, [location.state]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', phone: '', gender: '' });
  };

// Profile picture upload handler removed

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) { setError(passwordError); return; }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/api/login`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuth(true);

        if (formData.email === 'nutriwithdietex@gmail.com') {
          toast.success('Welcome Admin!');
          navigate('/admin');
        } else {
          toast.success(`Welcome back, ${res.data.user.name}!`);
          navigate(res.data.user.profileComplete ? '/dashboard' : '/onboarding');
        }

      } else {
        await axios.post(`${API_BASE_URL}/api/users`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          gender: formData.gender
        });

        const res = await axios.post(`${API_BASE_URL}/api/login`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

// Profile picture storage removed

        setAuth(true);
        toast.success(`Account created! Welcome, ${formData.name}`);
        navigate('/onboarding');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'An error occurred. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium relative flex flex-col items-center justify-center p-4 pt-8 sm:pt-4">
      
      <AestheticBackground bgImage={bgLanding} />



      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 px-4 bg-white/15 backdrop-blur-xl border border-white/25 rounded-xl text-white/80 hover:text-white transition-all hover:bg-white/25 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest z-50 shadow-sm"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-2 sm:gap-6 relative z-10">
        {/* Brand Header */}
        <div 
          className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-6 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-12 h-12 sm:w-32 sm:h-32 flex items-center justify-center transition-transform group-hover:scale-105">
             <img src={logo} alt="DietX Logo" className="w-full h-full object-contain rounded-3xl" />
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-2xl sm:text-6xl font-black text-white tracking-tighter leading-none">
              DIET<span className="text-emerald-400">X</span>
            </span>
            <span className="text-[10px] sm:text-base font-black text-white/50 uppercase tracking-widest mt-1">Holistic Wellness</span>
          </div>
        </div>

        <div className="glass-card w-full p-4 sm:p-10 flex flex-col gap-3 sm:gap-5">

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isLogin ? 'Welcome back' : 'Join us'}
            </h2>
            <p className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5">
              {isLogin ? 'Please enter your details to sign in' : 'Start your holistic health journey'}
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-red-500/20 border border-red-400/30 text-red-300 text-[9px] sm:text-[10px] rounded-xl text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3">

            <div className={`transition-all duration-300 overflow-hidden ${!isLogin ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-field pl-12 py-2 sm:py-3 text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${!isLogin ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input-field pl-12 py-2 sm:py-3 text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required={!isLogin}
                />
                          </div>
{!isLogin && (
  <div className="flex items-center gap-4 mt-2">
    <label className="text-white/70 font-black text-sm">Gender</label>
    <div className="flex gap-2">
      <label className="flex items-center gap-1 text-white/70">
        <input
          type="radio"
          name="gender"
          value="male"
          checked={formData.gender === 'male'}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="accent-emerald-500"
        />
        Male
      </label>
      <label className="flex items-center gap-1 text-white/70">
        <input
          type="radio"
          name="gender"
          value="female"
          checked={formData.gender === 'female'}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="accent-emerald-500"
        />
        Female
      </label>
    </div>
  </div>
)}
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field pl-12 py-2 sm:py-3 text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field pl-12 pr-12 py-2 sm:py-3 text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {!isLogin && (
              <p className="text-[10px] text-white/40 px-2 leading-tight">
                8+ characters, uppercase, and a number.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-1 py-2.5 sm:py-3 text-sm"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

          <div className="text-center pt-2 sm:pt-4 border-t border-white/10">
            <p className="text-[11px] sm:text-xs text-white/50 font-medium">
              {isLogin ? "New to DietX? " : "Already have an account? "}
              <button
                onClick={handleToggle}
                className="text-emerald-400 font-black hover:text-emerald-300 transition-colors ml-1"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
