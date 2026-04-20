import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Info, Menu, X, LayoutDashboard, User, ChevronRight } from 'lucide-react';

import logo from '../assets/logo.png';

interface NavbarProps {
  setIsAuthenticated: (val: boolean) => void;
}

const Navbar = ({ setIsAuthenticated }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Brand - Systematically aligned */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0" 
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-50 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
               <img src={logo} alt="DietX Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                DIET<span className="text-emerald-600">X</span>
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Holistic Wellness</span>
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
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                   {link.icon}
                   {link.name}
                </button>
            ))}

            <div className="w-px h-6 bg-slate-100 mx-4" />

            <button 
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-3 p-1.5 pr-5 rounded-2xl border transition-all ${
                location.pathname === '/profile' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-inner' 
                : 'border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
                    location.pathname === '/profile' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-100 text-slate-400'
                }`}>
                    <User size={18} />
                </div>
                <span className="text-sm font-black">Profile</span>
            </button>

            <button 
              onClick={handleLogout}
              className="ml-2 p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
              title="Logout"
            >
              <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
            isOpen ? 'bg-slate-900/40 opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Side Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-premium shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 p-1.5">
                    <img src={logo} alt="DietX" className="w-full h-full object-contain" />
                 </div>
                 <span className="font-black text-slate-900">DIETX</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400"><X size={20} /></button>
        </div>

        <div className="flex-1 p-6 space-y-3">
            {[
                { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
                { name: 'About Us', path: '/about', icon: <Info size={20} /> },
                { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
            ].map((link) => (
                <button 
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`flex items-center justify-between w-full p-4 rounded-2xl font-black transition-all ${
                        location.pathname === link.path ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        {link.icon}
                        {link.name}
                    </div>
                    {location.pathname !== link.path && <ChevronRight size={16} className="text-slate-300" />}
                </button>
            ))}
        </div>

        <div className="p-6 border-t border-slate-50">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-600 font-black hover:bg-red-50 transition-all"
            >
                <LogOut size={20} /> Sign Out
            </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
