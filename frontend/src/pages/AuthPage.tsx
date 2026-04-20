import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';

interface AuthPageProps {
  setAuth: (val: boolean) => void;
}

const AuthPage = ({ setAuth }: AuthPageProps) => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.mode) {
      setIsLogin(location.state.mode === 'login');
    }
  }, [location.state]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
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
      if (passwordError) {
        setError(passwordError);
        return;
      }
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
        navigate(res.data.user.profileComplete ? '/dashboard' : '/onboarding');
      } else {
        await axios.post('http://localhost:5001/api/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        const res = await axios.post('http://localhost:5001/api/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuth(true);
        navigate('/onboarding'); // new users always go to health setup
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] bg-premium relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 px-4 bg-white/40 backdrop-blur-xl border border-white/40 rounded-xl text-slate-500 hover:text-slate-900 transition-all hover:bg-white/60 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest z-50 shadow-sm"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-6 relative z-10">
        {/* Brand Header - Massive Floating Logo */}
        <div 
          className="flex flex-row items-center gap-6 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center transition-transform group-hover:scale-105">
             <img 
               src={logo} 
               alt="DietX Logo" 
               className="w-full h-full object-contain mix-blend-multiply"
               style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)' }}
             />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
              DIET<span className="text-emerald-600">X</span>
            </span>
            <span className="text-sm sm:text-xl font-black text-slate-400 uppercase tracking-widest mt-1">Holistic Wellness</span>
          </div>
        </div>

        <div className="glass-card w-full p-6 sm:p-10 flex flex-col gap-6 border-white/40 shadow-2xl">

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {isLogin ? 'Welcome back' : 'Join us'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isLogin ? 'Please enter your details to sign in' : 'Start your holistic health journey'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] rounded-xl text-center font-bold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <div className={`transition-all duration-300 overflow-hidden ${!isLogin ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {!isLogin && (
              <p className="text-[10px] text-slate-400 px-2 leading-tight">
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

          <div className="text-center pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-500 font-medium">
              {isLogin ? "New to DietX? " : "Already have an account? "}
              <button
                onClick={handleToggle}
                className="text-slate-900 font-bold hover:underline transition-colors ml-1"
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
