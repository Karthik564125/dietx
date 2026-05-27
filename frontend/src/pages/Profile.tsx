import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Mail, Shield, Save, CheckCircle, ArrowLeft, Activity, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import AestheticBackground from '../components/AestheticBackground';
import bgDashboard from '../assets/dashboard.jpeg';

interface ProfileProps {
  setIsAuthenticated: (val: boolean) => void;
}

const Profile = ({ setIsAuthenticated }: ProfileProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    name: JSON.parse(localStorage.getItem('user') || '{}').name || '', 
    email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
    phone: JSON.parse(localStorage.getItem('user') || '{}').phone || '' 
  });
  const [healthStats, setHealthStats] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }

    axios.get('http://localhost:5001/api/health-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setFormData({
          name: res.data.name || formData.name,
          email: res.data.email || formData.email,
          phone: res.data.phone || formData.phone
        });
        if (res.data.health) setHealthStats(res.data.health);
      })
      .catch(err => console.error('Profile fetch error:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsUpdating(true);
    try {
      await axios.post('http://localhost:5001/api/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.name = formData.name;
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed', err);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-premium relative overflow-hidden">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <AestheticBackground bgImage={bgDashboard} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-12 py-12">
          <header className="space-y-6 text-center">
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-6 py-2 bg-white/15 backdrop-blur-xl border border-white/20 rounded-full text-white/70 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </button>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none">
                Account <span className="text-emerald-400">Settings</span>
              </h1>
              <p className="text-white/60 font-bold text-lg sm:text-xl uppercase tracking-widest">Profile Control Center</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info Sidebar */}
            <div className="md:col-span-1 space-y-6">

              {/* User Info Card */}
              <div className="glass-card p-8 flex flex-col items-center text-center space-y-5">
                <h3 className="font-black text-xl text-white">{formData.name}</h3>
                <p className="text-sm font-bold text-white/50">{formData.email}</p>
                <div className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-400/30">
                  Verified User
                </div>
              </div>

              {/* Bio-Vitals Summary */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 text-white border-b border-white/10 pb-3">
                  <Activity size={18} className="text-emerald-400" />
                  <span className="text-sm font-black uppercase tracking-widest">Bio-Vitals Summary</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/50">BMI Index</span>
                    <span className="text-sm font-black text-white">{healthStats?.bmi || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/50">Weight</span>
                    <span className="text-sm font-black text-white">{healthStats?.weight || '--'} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/50">Ideal Weight</span>
                    <span className="text-sm font-black text-emerald-400">{healthStats?.idealWeight ? `${healthStats.idealWeight} kg` : '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/50">Daily Goal</span>
                    <span className="text-sm font-black text-white">{healthStats?.dailyCalories || '--'} kcal</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <Shield size={18} className="text-emerald-400" />
                  <span className="text-sm font-bold">Privacy Secured</span>
                </div>
                <p className="text-xs text-white/50 font-medium leading-relaxed">
                  Your health data is encrypted and only used to personalize your diet plans.
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="md:col-span-2 glass-card p-10">
              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        type="text" 
                        className="input-field pl-12"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        type="email" 
                        className="input-field pl-12 opacity-50 cursor-not-allowed"
                        value={formData.email}
                        disabled
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        type="tel" 
                        className="input-field pl-12"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Your Phone Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 btn-primary"
                  >
                    {isUpdating ? 'Updating...' : (
                      <>
                        <Save size={18} /> Update Profile
                      </>
                    )}
                  </button>
                  {success && (
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-sm animate-in fade-in slide-in-from-left-4">
                      <CheckCircle size={20} /> Saved!
                    </div>
                  )}
                </div>
              </form>

              <div className="mt-12 pt-10 border-t-2 border-white/10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-white">Health Bio Specs</h4>
                    <p className="text-sm font-medium text-white/50">Update your physical metrics like Height, Weight, and Activity Level.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/onboarding', { state: { from: '/profile' } })}
                    className="px-8 py-4 bg-emerald-600/80 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 group whitespace-nowrap shadow-lg shadow-emerald-900/20 border border-emerald-400/30"
                  >
                    <Activity size={18} className="group-hover:animate-pulse" /> Update Bio Metrics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Profile;
