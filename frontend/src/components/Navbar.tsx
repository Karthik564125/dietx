import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Info, Menu, X, LayoutDashboard, User, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

const PROFILE_PIC_KEY = 'dietx_profile_pic';

interface NavbarProps {
  setIsAuthenticated: (val: boolean) => void;
}

const Navbar = ({ setIsAuthenticated }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(
    localStorage.getItem(PROFILE_PIC_KEY)
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sync = () => setProfilePic(localStorage.getItem(PROFILE_PIC_KEY));
    window.addEventListener('storage', sync);
    sync();
    setIsOpen(false); // close mobile menu on route change
    return () => window.removeEventListener('storage', sync);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <>
      <div className="p-4 sm:p-6 pb-0 sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl bg-black/30 backdrop-blur-2xl border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.2)] rounded-[2.5rem] transition-all">
          <div className="px-6 h-20 flex justify-between items-center">
          
          {/* Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0" 
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-12 h-12 bg-white/15 rounded-xl border border-white/20 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
               <img src={logo} alt="DietX Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tighter leading-none">
                DIET<span className="text-emerald-400">X</span>
              </span>
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mt-0.5">Holistic Wellness</span>
            </div>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {[
                { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={14} /> },
                { name: 'About', path: '/about', icon: <Info size={14} /> },
            ].map((link) => (
                <button 
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    location.pathname === link.path 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                   {link.icon}
                   {link.name}
                </button>
            ))}

            <div className="w-px h-6 bg-white/15 mx-4" />

            <button 
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-3 p-1.5 pr-5 rounded-2xl border transition-all ${
                location.pathname === '/profile' 
                ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' 
                : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden ${
                    location.pathname === '/profile' ? 'ring-2 ring-emerald-400' : 'bg-white/10 border border-white/15'
                }`}>
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-white/60" />
                    )}
                </div>
                <span className="text-sm font-black">Profile</span>
            </button>

            <button 
              onClick={handleLogout}
              className="ml-2 p-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
              title="Logout"
            >
              <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/10 text-white border border-white/15 shadow-sm"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-700 md:hidden ${
            isOpen ? 'bg-slate-900/40 backdrop-blur-md opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Side Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm bg-black/60 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)] rounded-l-[3rem] transition-transform duration-700 md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-10 flex justify-between items-center border-b border-white/10">
             <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <img src={logo} alt="DietX" className="w-full h-full object-contain p-2" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-2xl tracking-tighter text-white leading-none">DIET<span className="text-emerald-400">X</span></span>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Holistic Life</span>
                  </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl text-white/60 hover:text-white transition-all"><X size={24} /></button>
        </div>

        <div className="flex-1 px-8 space-y-4 mt-10">
            {[
                { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} /> },
                { name: 'About Us', path: '/about', icon: <Info size={22} /> },
                { name: 'My Profile', path: '/profile', icon: <User size={22} /> },
            ].map((link) => (
                <button 
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`flex items-center justify-between w-full p-5 rounded-[2rem] font-black transition-all duration-500 ${
                        location.pathname === link.path 
                          ? 'bg-emerald-500/30 text-white border border-emerald-400/30 translate-x-2' 
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <div className="flex items-center gap-5">
                        {link.icon}
                        <span className="text-xl tracking-tight">{link.name}</span>
                    </div>
                    {location.pathname !== link.path && <ChevronRight size={18} className="text-white/30" />}
                </button>
            ))}
        </div>

        <div className="p-8 mb-6">
            <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-4 w-full p-6 rounded-[2rem] bg-red-500/10 text-red-400 font-black hover:bg-red-500/20 border border-red-400/20 transition-all duration-500"
            >
                <LogOut size={22} /> <span className="text-lg">Sign Out</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
