import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
   Users,
   CreditCard,
   TrendingUp,
   Search,
   Download,
   LogOut,
   Mail,
   Phone,
   Scale,
   Ruler,
   Zap,
   Activity,
   X,
   User as UserIcon,
   ShoppingBag,
   Leaf,
   ChevronRight,
   RefreshCw,
   SlidersHorizontal,
} from 'lucide-react';

import logo from '../assets/logo.png';
import AestheticBackground from '../components/AestheticBackground';
import { API_BASE_URL } from '../config';

const AdminDashboard = ({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) => {
   const navigate = useNavigate();
   const [data, setData] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [activeTab, setActiveTab] = useState<'users' | 'purchases'>('users');
   const [planFilter, setPlanFilter] = useState<'all' | 'pcod' | 'personal' | 'recipes'>('all');
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [showLogoutDialog, setShowLogoutDialog] = useState(false);

   const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/auth'); return; }
      try {
         const res = await axios.get(`${API_BASE_URL}/api/admin/data`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         setData(res.data.data);
      } catch (err) {
         console.error('Failed to fetch admin data', err);
         navigate('/dashboard');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => { fetchData(); }, []);

   const confirmLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/auth');
   };

   const downloadCSV = () => {
      if (!data) return;
      const items = activeTab === 'users' ? data.users : data.purchases;
      if (items.length === 0) return;
      const headers = Object.keys(items[0]);
      const csvContent = [
         headers.join(','),
         ...items.map((item: any) =>
            headers.map(header => `"${String(item[header]).replace(/"/g, '""')}"`).join(',')
         )
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `dietx_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   if (loading) {
      return (
         <div className="h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            <AestheticBackground />
            <div className="relative">
               <div className="w-16 h-16 border-[3px] border-emerald-100 rounded-full" />
               <div className="absolute inset-0 w-16 h-16 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
         </div>
      );
   }

   const pcodCount = data?.purchases?.filter((p: any) => p.planName === 'pcod_consultancy').length || 0;
   const personalCount = data?.purchases?.filter((p: any) => p.planName === 'personal_consultancy' || Number(p.amount) === 1499).length || 0;
   const recipesCount = data?.purchases?.filter((p: any) => p.planName === 'suggested_recipes' || Number(p.amount) === 99).length || 0;

   const filteredUsers = data?.users.filter((u: any) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
   );

   const filteredPurchases = data?.purchases?.filter((p: any) => {
      const matchesSearch = [p.email, p.phone, p.razorpayPaymentId, p.razorpayOrderId]
         .filter(Boolean).some((v: any) => String(v).toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch && searchTerm.trim() !== '') return false;
      if (planFilter === 'pcod' && p.planName !== 'pcod_consultancy') return false;
      if (planFilter === 'personal' && p.planName !== 'personal_consultancy' && Number(p.amount) !== 1499) return false;
      if (planFilter === 'recipes' && p.planName !== 'suggested_recipes' && Number(p.amount) !== 99) return false;
      return true;
   });

   const getPlanLabel = (p: any) => {
      if (p.planName === 'pcod_consultancy') return { label: 'PCOD Consult', color: 'bg-rose-50 text-rose-600 border-rose-100' };
      if (p.planName === 'personal_consultancy' || Number(p.amount) === 1499) return { label: 'Personal Consult', color: 'bg-amber-50 text-amber-700 border-amber-100' };
      return { label: 'Suggested Recipes', color: 'bg-blue-50 text-blue-600 border-blue-100' };
   };

   const getAvatarColor = (gender: string) => {
      if (gender?.toLowerCase() === 'female') return 'bg-rose-500';
      if (gender?.toLowerCase() === 'male') return 'bg-blue-600';
      return 'bg-slate-700';
   };

   const getBMIColor = (bmi: number) => {
      if (!bmi) return 'bg-slate-100 text-slate-500';
      if (bmi < 18.5) return 'bg-blue-50 text-blue-600';
      if (bmi <= 24.9) return 'bg-emerald-50 text-emerald-700';
      if (bmi <= 29.9) return 'bg-amber-50 text-amber-700';
      return 'bg-rose-50 text-rose-600';
   };

   return (
      <div className="min-h-screen bg-[#F5F7FA] flex font-sans relative overflow-hidden">
         <AestheticBackground />

         {/* ── Sidebar ─── */}
         <aside className="w-64 bg-white border-r border-slate-100 hidden xl:flex flex-col sticky top-0 h-screen z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.04)]">

            {/* Brand */}
            <div className="px-6 py-7 border-b border-slate-50">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                     <img src={logo} alt="Logo" className="w-5 h-5 rounded-md" />
                  </div>
                  <div>
                     <span className="font-black text-lg tracking-tighter text-slate-900 leading-none">Diet<span className="text-emerald-500">X</span></span>
                     <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 mt-0.5">Admin Console</p>
                  </div>
               </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1">
               <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 px-3 mb-3">Navigation</p>
               {[
                  { id: 'users', label: 'Members', icon: <Users size={17} />, count: data?.stats?.totalUsers },
                  { id: 'purchases', label: 'Transactions', icon: <CreditCard size={17} />, count: data?.stats?.totalPurchases }
               ].map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                  >
                     <div className="flex items-center gap-3">
                        <span className={activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400'}>{tab.icon}</span>
                        {tab.label}
                     </div>
                     <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                           {tab.count ?? 0}
                        </span>
                        {activeTab === tab.id && <ChevronRight size={14} className="text-emerald-400" />}
                     </div>
                  </button>
               ))}

               <div className="pt-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 px-3 mb-3">Overview</p>
                  <div className="px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                     {[
                        { label: 'PCOD Consults', value: pcodCount, dot: 'bg-rose-400' },
                        { label: 'Personal Plans', value: personalCount, dot: 'bg-amber-400' },
                        { label: 'Recipes Sold', value: recipesCount, dot: 'bg-blue-400' },
                     ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                              <span className="text-slate-500 font-medium">{item.label}</span>
                           </div>
                           <span className="font-black text-slate-800">{item.value}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </nav>

            {/* Footer */}
            <div className="px-4 py-5 border-t border-slate-50 space-y-1">
               <button
                  onClick={fetchData}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all font-semibold"
               >
                  <RefreshCw size={16} /> Refresh Data
               </button>
               <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all font-semibold"
               >
                  <LogOut size={16} /> Sign Out
               </button>
            </div>
         </aside>

         {/* ── Main ─── */}
         <main className="flex-1 min-w-0 overflow-auto">

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-20 px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="xl:hidden w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                     <img src={logo} alt="Logo" className="w-4 h-4" />
                  </div>
                  <div>
                     <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                        {activeTab === 'users' ? 'Member Management' : 'Transaction History'}
                     </h1>
                     <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {activeTab === 'users' ? `${filteredUsers?.length ?? 0} members` : `${filteredPurchases?.length ?? 0} transactions`}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                     <input
                        type="text"
                        placeholder={activeTab === 'users' ? 'Search members...' : 'Search transactions...'}
                        className="w-60 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 focus:bg-white transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <button
                     onClick={downloadCSV}
                     className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-all shadow-sm"
                  >
                     <Download size={15} /> Export
                  </button>
               </div>
            </header>

            <div className="p-6 sm:p-8 space-y-6">

               {/* ── Stats Row ── */}
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {[
                     { label: 'Total Members', value: data?.stats?.totalUsers, icon: <Users size={16} />, accent: 'text-blue-600 bg-blue-50' },
                     { label: 'Total Sales', value: data?.stats?.totalPurchases, icon: <ShoppingBag size={16} />, accent: 'text-emerald-600 bg-emerald-50' },
                     { label: 'Revenue', value: `₹${data?.stats?.totalRevenue}`, icon: <TrendingUp size={16} />, accent: 'text-violet-600 bg-violet-50' },
                     { label: 'PCOD Consults', value: pcodCount, icon: <Activity size={16} />, accent: 'text-rose-500 bg-rose-50' },
                     { label: 'Personal Plans', value: personalCount, icon: <UserIcon size={16} />, accent: 'text-amber-600 bg-amber-50' },
                     { label: 'Recipes Sold', value: recipesCount, icon: <Leaf size={16} />, accent: 'text-teal-600 bg-teal-50' },
                  ].map((stat, i) => (
                     <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 hover:shadow-md hover:shadow-slate-100 transition-all duration-300">
                        <div className={`w-8 h-8 ${stat.accent} rounded-lg flex items-center justify-center`}>
                           {stat.icon}
                        </div>
                        <div>
                           <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">{stat.label}</p>
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* ── Table Panel ── */}
               <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                  {/* Table Header */}
                  <div className="px-6 py-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div className="flex items-center gap-6">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
                           {[
                              { id: 'users', label: 'Members', icon: <Users size={14} /> },
                              { id: 'purchases', label: 'Payments', icon: <CreditCard size={14} /> }
                           ].map(tab => (
                              <button
                                 key={tab.id}
                                 onClick={() => setActiveTab(tab.id as any)}
                                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                              >
                                 {tab.icon} {tab.label}
                              </button>
                           ))}
                        </div>

                        {/* Live badge */}
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live</span>
                        </div>
                     </div>

                     {/* Filter Pills (purchases only) */}
                     {activeTab === 'purchases' && (
                        <div className="flex items-center gap-1.5">
                           <SlidersHorizontal size={13} className="text-slate-400 mr-1" />
                           {(['all', 'pcod', 'personal', 'recipes'] as const).map(f => (
                              <button
                                 key={f}
                                 onClick={() => setPlanFilter(f)}
                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${planFilter === f ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                              >
                                 {f}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b border-slate-50">
                              {activeTab === 'users' ? (
                                 <>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">Member</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">Health</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">Contact</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60 text-right">Action</th>
                                 </>
                              ) : (
                                 <>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">ID</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">Customer</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">Plan</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">Amount</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60">Date</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/60 text-right">Status</th>
                                 </>
                              )}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {activeTab === 'users' ? (
                              filteredUsers?.map((u: any) => (
                                 <tr key={u.id} className="group hover:bg-slate-50/70 transition-colors">
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 ${getAvatarColor(u.gender)} text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0`}>
                                             {u.name?.charAt(0)?.toUpperCase()}
                                          </div>
                                          <div>
                                             <p className="font-bold text-slate-900 text-sm leading-tight">{u.name}</p>
                                             <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                                             </p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                          <span className={`px-2 py-1 rounded-lg text-xs font-black ${getBMIColor(u.bmi)}`}>
                                             {u.bmi ? `BMI ${u.bmi}` : '—'}
                                          </span>
                                          <span className="text-xs text-slate-500 font-semibold">{u.age ? `${u.age}y` : '—'}</span>
                                          <span className="text-[10px] text-slate-400 font-medium capitalize">{u.gender || ''}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                          <Mail size={12} className="text-slate-300 flex-shrink-0" /> {u.email}
                                       </p>
                                       <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-1">
                                          <Phone size={12} className="text-slate-300 flex-shrink-0" /> {u.phone || 'N/A'}
                                       </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <button
                                          onClick={() => setSelectedUser(u)}
                                          className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-all shadow-sm group-hover:shadow-md"
                                       >
                                          View
                                       </button>
                                    </td>
                                 </tr>
                              ))
                           ) : (
                              filteredPurchases?.map((p: any) => {
                                 const plan = getPlanLabel(p);
                                 return (
                                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                       <td className="px-6 py-4">
                                          <p className="font-mono text-xs font-bold text-slate-700">
                                             #{p.razorpayPaymentId?.slice(-8) ?? 'N/A'}
                                          </p>
                                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                             Ref: {p.razorpayOrderId?.slice(-6) ?? 'N/A'}
                                          </p>
                                       </td>
                                       <td className="px-6 py-4">
                                          <p className="text-sm font-bold text-slate-800">{p.email}</p>
                                          <p className="text-xs text-slate-400 font-medium mt-0.5">{p.phone || 'N/A'}</p>
                                       </td>
                                       <td className="px-6 py-4">
                                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${plan.color}`}>
                                             {plan.label}
                                          </span>
                                       </td>
                                       <td className="px-6 py-4">
                                          <p className="text-lg font-black text-slate-900 tracking-tight">₹{p.amount}</p>
                                       </td>
                                       <td className="px-6 py-4">
                                          <p className="text-xs text-slate-500 font-medium">
                                             {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                          </p>
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wide border border-emerald-100">
                                             <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                             Paid
                                          </span>
                                       </td>
                                    </tr>
                                 );
                              })
                           )}
                        </tbody>
                     </table>

                     {/* Empty state */}
                     {((activeTab === 'users' && filteredUsers?.length === 0) ||
                        (activeTab === 'purchases' && filteredPurchases?.length === 0)) && (
                           <div className="py-16 text-center">
                              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                 <Search size={20} className="text-slate-400" />
                              </div>
                              <p className="text-sm font-bold text-slate-500">No results found</p>
                              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                           </div>
                        )}
                  </div>
               </div>
            </div>
         </main>

         {/* ── User Detail Modal ── */}
         {selectedUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
               <div
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                  onClick={() => setSelectedUser(null)}
               />
               <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

                  {/* Modal Header */}
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 ${getAvatarColor(selectedUser.gender)} text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg`}>
                           {selectedUser.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                           <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedUser.name}</h2>
                           <div className="flex items-center gap-4 mt-1.5">
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                 <Mail size={12} className="text-emerald-400" /> {selectedUser.email}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                 <Phone size={12} className="text-emerald-400" /> {selectedUser.phone || 'N/A'}
                              </span>
                           </div>
                        </div>
                     </div>
                     <button
                        onClick={() => setSelectedUser(null)}
                        className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                     >
                        <X size={18} />
                     </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-8">

                     {/* Biometrics */}
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                           { label: 'Weight', value: `${selectedUser.weight || '—'} kg`, icon: <Scale size={16} /> },
                           { label: 'Height', value: `${selectedUser.height || '—'} cm`, icon: <Ruler size={16} /> },
                           { label: 'Age', value: `${selectedUser.age || '—'} yrs`, icon: <UserIcon size={16} /> },
                           { label: 'Daily Cal.', value: `${selectedUser.dailyCalories || '—'}`, icon: <Zap size={16} /> }
                        ].map((stat, i) => (
                           <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="text-emerald-500 mb-3">{stat.icon}</div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                              <p className="text-lg font-black text-slate-900">{stat.value}</p>
                           </div>
                        ))}
                     </div>

                     {/* BMI + Diet + Health */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Medical History</h4>
                              <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 font-medium leading-relaxed">
                                 {selectedUser.medicalConditions || 'No significant history reported.'}
                              </p>
                           </div>
                           <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Allergies</h4>
                              <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 font-medium leading-relaxed">
                                 {selectedUser.allergies || 'No allergies on record.'}
                              </p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           {/* BMI Card */}
                           <div className="bg-slate-900 rounded-2xl p-6 text-white">
                              <div className="flex items-center gap-2 mb-5">
                                 <Activity className="text-emerald-400" size={18} />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Body Stats</span>
                              </div>
                              <div className="flex justify-between items-end">
                                 <div>
                                    <p className="text-5xl font-black tracking-tighter">{selectedUser.bmi || '—'}</p>
                                    <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-1">{selectedUser.bmiCategory || 'Pending'}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Activity</p>
                                    <p className="text-sm font-black text-white mt-1 capitalize">{selectedUser.activityLevel || 'Moderate'}</p>
                                 </div>
                              </div>
                           </div>

                           {/* Diet Pref */}
                           <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-center justify-between">
                              <div>
                                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Dietary Preference</p>
                                 <p className="text-base font-black text-emerald-900 mt-0.5">{selectedUser.dietaryPreferences || 'Standard'}</p>
                              </div>
                              <Leaf size={28} className="text-emerald-200" />
                           </div>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a
                           href={`mailto:${selectedUser.email}`}
                           className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-sm"
                        >
                           <Mail size={16} /> Send Report
                        </a>
                        <a
                           href={`tel:${selectedUser.phone}`}
                           className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-all"
                        >
                           <Phone size={16} /> Call Member
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* ── Logout Dialog ── */}
         {showLogoutDialog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowLogoutDialog(false)} />
               <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5">
                     <LogOut size={26} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1.5">Sign out?</h3>
                  <p className="text-sm text-slate-500 font-medium mb-7">You'll need to log in again to access the admin panel.</p>
                  <div className="flex gap-3 w-full">
                     <button
                        onClick={() => setShowLogoutDialog(false)}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={confirmLogout}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
                     >
                        Sign out
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminDashboard;