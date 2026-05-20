import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft, Phone, Camera, Trash2 } from 'lucide-react';

import logo from '../assets/logo.png';
import AestheticBackground from '../components/AestheticBackground';
import bgLanding from '../assets/landingpage.jpeg';

const PROFILE_PIC_KEY = 'dietx_profile_pic';

interface AuthPageProps {
  setAuth: (val: boolean) => void;
}

const AuthPage = ({ setAuth }: AuthPageProps) => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Profile picture
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [picHover, setPicHover] = useState(false);

  useEffect(() => {
    if (location.state?.mode) {
      setIsLogin(location.state.mode === 'login');
    }
  }, [location.state]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', phone: '' });
    setProfilePic(null);
  };

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

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
        const res = await axios.post('http://localhost:5001/api/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuth(true);

        if (formData.email === 'nutriwithdietex@gmail.com') {
          navigate('/admin');
        } else {
          navigate(res.data.user.profileComplete ? '/dashboard' : '/onboarding');
        }

      } else {
        await axios.post('http://localhost:5001/api/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });

        const res = await axios.post('http://localhost:5001/api/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Save profile pic if user uploaded one
        if (profilePic) {
          localStorage.setItem(PROFILE_PIC_KEY, profilePic);
        }

        setAuth(true);
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      <AestheticBackground bgImage={bgLanding} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePicUpload}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 px-4 bg-white/15 backdrop-blur-xl border border-white/25 rounded-xl text-white/80 hover:text-white transition-all hover:bg-white/25 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest z-50 shadow-sm"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-6 relative z-10">
        {/* Brand Header */}
        <div 
          className="flex flex-row items-center gap-6 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center transition-transform group-hover:scale-105">
             <img src={logo} alt="DietX Logo" className="w-full h-full object-contain rounded-3xl" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
              DIET<span className="text-emerald-400">X</span>
            </span>
            <span className="text-xs sm:text-base font-black text-white/50 uppercase tracking-widest mt-1">Holistic Wellness</span>
          </div>
        </div>

        <div className="glass-card w-full p-6 sm:p-10 flex flex-col gap-5">

          <div className="text-center">
            <h2 className="text-2xl font-black text-white">
              {isLogin ? 'Welcome back' : 'Join us'}
            </h2>
            <p className="text-xs text-white/60 font-medium mt-1">
              {isLogin ? 'Please enter your details to sign in' : 'Start your holistic health journey'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-400/30 text-red-300 text-[10px] rounded-xl text-center font-bold">
              {error}
            </div>
          )}

          {/* ── PROFILE PICTURE (Sign Up only) ── */}
          <div className={`transition-all duration-500 overflow-hidden ${!isLogin ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center gap-3 py-2">
              {/* Avatar */}
              <div
                className="relative cursor-pointer group/avatar"
                onMouseEnter={() => setPicHover(true)}
                onMouseLeave={() => setPicHover(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-white/20 shadow-lg relative">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <Camera size={28} className="text-white/40" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${picHover ? 'opacity-100' : 'opacity-0'}`}>
                    <Camera size={22} className="text-white" />
                  </div>
                </div>
                {/* Dashed ring when empty */}
                {!profilePic && (
                  <div className="absolute -inset-1 rounded-[2rem] border-2 border-dashed border-emerald-400/40 animate-pulse" />
                )}
              </div>

              {/* Label + remove */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors"
                >
                  {profilePic ? 'Change photo' : 'Add photo (optional)'}
                </button>
                {profilePic && (
                  <button
                    type="button"
                    onClick={() => setProfilePic(null)}
                    className="text-[10px] font-black text-red-400/70 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <div className={`transition-all duration-300 overflow-hidden ${!isLogin ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-field pl-12 py-3 text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${!isLogin ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input-field pl-12 py-3 text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required={!isLogin}
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field pl-12 py-3 text-sm"
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
                className="input-field pl-12 pr-12 py-3 text-sm"
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
              className="btn-primary mt-2 py-3 text-sm"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 font-medium">
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
