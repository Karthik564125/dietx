import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Info, Menu, X, LayoutDashboard, User, Users, ChevronRight } from 'lucide-react';


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
      <div className="p-4 sm:p-6 pb-0 sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl bg-emerald-100/40 backdrop-blur-2xl border border-emerald-200/50 shadow-[0_8px_30px_rgba(5,150,105,0.1)] rounded-[2.5rem] transition-all">
          <div className="px-6 h-20 flex justify-between items-center">
          
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
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50' 
                    : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'
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
                : 'border-transparent text-slate-600 hover:bg-emerald-50'
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
            className="md:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 shadow-sm"
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
      <div className={`fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm bg-white/70 backdrop-blur-3xl border-l border-white/40 shadow-[0_0_80px_rgba(5,150,105,0.2)] rounded-l-[3rem] transition-transform duration-700 md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-10 flex justify-between items-center border-b border-emerald-50">
             <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-white p-2.5">
                     <img src={logo} alt="DietX" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">DIET<span className="text-emerald-500">X</span></span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Holistic Life</span>
                  </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-inner"><X size={24} /></button>
        </div>

        <div className="flex-1 px-8 space-y-4 mt-10">
            {[
                { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} /> },
                { name: 'Who Are We', path: '/who-are-we', icon: <Users size={22} /> },
                { name: 'About Us', path: '/about', icon: <Info size={22} /> },
                { name: 'My Profile', path: '/profile', icon: <User size={22} /> },
            ].map((link) => (
                <button 
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`flex items-center justify-between w-full p-5 rounded-[2rem] font-black transition-all duration-500 ${
                        location.pathname === link.path ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 translate-x-2' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                >
                    <div className="flex items-center gap-5">
                        {link.icon}
                        <span className="text-xl tracking-tight">{link.name}</span>
                    </div>
                    {location.pathname !== link.path && <ChevronRight size={18} className="text-slate-300" />}
                </button>
            ))}
        </div>

        <div className="p-8 mb-6">
            <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-4 w-full p-6 rounded-[2rem] bg-slate-900 text-red-400 font-black hover:bg-red-500 hover:text-white shadow-2xl shadow-slate-900/10 transition-all duration-500"
            >
                <LogOut size={22} /> <span className="text-lg">Sign Out</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
