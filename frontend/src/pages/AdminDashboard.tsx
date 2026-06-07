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
  Filter,
  Leaf
} from 'lucide-react';

import logo from '../assets/logo.png';
import AestheticBackground from '../components/AestheticBackground';

const AdminDashboard = ({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'purchases'>('users');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }

    try {
      const res = await axios.get('http://localhost:5001/api/admin/data', {
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

  useEffect(() => {
    fetchData();
  }, []);

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
        headers.map(header => {
          const val = item[header];
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dietx_${activeTab}_report_${new Date().toISOString().slice(0,10)}.csv`);
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
           <div className="w-20 h-20 border-4 border-emerald-100 rounded-full" />
           <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const filteredUsers = data?.users.filter((u: any) => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const filteredPurchases = data?.purchases.filter((p: any) => 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm) ||
    p.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.razorpayOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.amount < 200 ? 'suggested recipes' : 'personal consultancy').includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: data?.stats.totalUsers, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Sales', value: data?.stats.totalPurchases, icon: <ShoppingBag size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Revenue', value: `₹${data?.stats.totalRevenue}`, icon: <TrendingUp size={24} />, color: 'text-violet-600', bg: 'bg-violet-50' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative overflow-hidden">
      <AestheticBackground />
      
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col sticky top-0 h-screen z-30">
        <div className="p-8 pb-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-slate-800">
                <img src={logo} alt="Logo" className="w-7 h-7 rounded-lg" />
             </div>
             <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">ADMIN<span className="text-emerald-600">X</span></span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Management Hub</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'users', label: 'Users', icon: <Users size={20} /> },
            { id: 'purchases', label: 'Payments', icon: <CreditCard size={20} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8 space-y-4">
           <button 
             onClick={() => setShowLogoutDialog(true)}
             className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-red-500 hover:bg-red-50 transition-all duration-300"
           >
             <LogOut size={20} /> Sign Out
           </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-3xl border-b border-slate-200 sticky top-0 z-20 px-6 sm:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="xl:hidden w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                 <img src={logo} alt="Logo" className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight capitalize">
                 {activeTab === 'users' ? 'Member Management' : 'Transaction History'}
              </h1>
           </div>

           <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search members..." 
                   className="w-full sm:w-80 bg-slate-100 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none font-bold"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                 <Filter size={20} className="text-slate-500" />
              </button>
              <button onClick={fetchData} className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm text-emerald-600">
                 <TrendingUp size={20} />
              </button>
           </div>
        </header>

        <div className="p-6 sm:p-10 space-y-10">
           
           {/* Stats Summary */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col gap-6 group hover:-translate-y-1 transition-all duration-500">
                   <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Table Section */}
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/30 overflow-hidden">
              <div className="px-8 sm:px-10 py-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500">Live Member Feed</span>
                 </div>
                 <button 
                   onClick={downloadCSV}
                   className="flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
                 >
                    <Download size={16} /> Export Data
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                          {activeTab === 'users' ? (
                             <>
                                <th className="px-10 py-6">Member</th>
                                <th className="px-10 py-6">Health Data</th>
                                <th className="px-10 py-6">Contact Info</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                             </>
                          ) : (
                             <>
                                <th className="px-10 py-6">Transaction</th>
                                <th className="px-10 py-6">Customer</th>
                                <th className="px-10 py-6">Plan Info</th>
                                <th className="px-10 py-6">Revenue</th>
                                <th className="px-10 py-6">Date</th>
                                <th className="px-10 py-6 text-right">Status</th>
                             </>
                          )}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {activeTab === 'users' ? (
                          filteredUsers.map((u: any) => (
                             <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8">
                                   <div className="flex items-center gap-5">
                                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-slate-900/10 group-hover:bg-emerald-600 transition-colors">
                                         {u.name?.charAt(0)}
                                      </div>
                                      <div>
                                         <p className="font-black text-slate-900 text-lg leading-none">{u.name}</p>
                                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{u.id.slice(0, 8)}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                   <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                         <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${u.bmi > 25 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>BMI {u.bmi || '--'}</span>
                                         <span className="text-xs font-black text-slate-900">{u.age || '--'} Yrs</span>
                                      </div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.gender || 'Unknown'}</p>
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                   <div className="space-y-1">
                                      <p className="text-sm font-bold text-slate-600 flex items-center gap-2"><Mail size={14} className="text-slate-300" /> {u.email}</p>
                                      <p className="text-sm font-bold text-slate-600 flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {u.phone || 'N/A'}</p>
                                   </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                   <button 
                                     onClick={() => setSelectedUser(u)}
                                     className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:text-white hover:bg-slate-900 transition-all shadow-sm"
                                   >
                                      View Profile
                                   </button>
                                </td>
                             </tr>
                          ))
                       ) : (
                          filteredPurchases.map((p: any) => (
                             <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8">
                                   <p className="font-mono text-xs font-black text-slate-900 tracking-wider uppercase">#{p.razorpayPaymentId ? p.razorpayPaymentId.slice(-10) : 'N/A'}</p>
                                   <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Ref: {p.razorpayOrderId ? p.razorpayOrderId.slice(-6) : 'N/A'}</p>
                                </td>
                                <td className="px-10 py-8">
                                   <p className="font-black text-slate-900">{p.email}</p>
                                   <p className="text-[10px] font-bold text-slate-400 mt-0.5">{p.phone || 'N/A'}</p>
                                </td>
                                <td className="px-10 py-8">
                                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                      p.amount < 200 
                                         ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                         : 'bg-amber-50 text-amber-600 border-amber-100'
                                   }`}>
                                      {p.amount < 200 ? 'Suggested Recipes' : 'Personal Consultancy'}
                                   </span>
                                </td>
                                <td className="px-10 py-8">
                                   <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{p.amount}</p>
                                </td>
                                <td className="px-10 py-8">
                                   <p className="text-sm text-slate-500">{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                                </td>
                                <td className="px-10 py-8 text-right">
                                   <span className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">Success</span>
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>
      </main>

      {/* ── Centered Detail Modal ─────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setSelectedUser(null)} />
           
           <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl shadow-slate-900/50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
              
              {/* Modal Header */}
              <header className="p-8 sm:p-12 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8 relative shrink-0">
                 <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                    <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-slate-900/20">
                       {selectedUser.name?.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">{selectedUser.name}</h2>
                       <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                             <Mail size={14} className="text-emerald-500" /> {selectedUser.email}
                          </span>
                          <span className="hidden sm:block text-slate-200">|</span>
                          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                             <Phone size={14} className="text-emerald-500" /> {selectedUser.phone || 'N/A'}
                          </span>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setSelectedUser(null)}
                   className="absolute top-8 right-8 sm:relative sm:top-0 sm:right-0 p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-inner"
                 >
                    <X size={24} />
                 </button>
              </header>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-12">
                 
                 {/* Biometric Stats Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                       { label: 'Weight', value: `${selectedUser.weight || '--'} kg`, icon: <Scale size={20} /> },
                       { label: 'Height', value: `${selectedUser.height || '--'} cm`, icon: <Ruler size={20} /> },
                       { label: 'Age', value: `${selectedUser.age || '--'} yrs`, icon: <UserIcon size={20} /> },
                       { label: 'Calories', value: `${selectedUser.dailyCalories || '--'}`, icon: <Zap size={20} /> }
                    ].map((stat, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          <div className="text-emerald-600 mb-4">{stat.icon}</div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                       </div>
                    ))}
                 </div>

                 {/* Information Sections */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Medical History</h4>
                          <p className="bg-slate-50 p-6 rounded-3xl border border-slate-100 font-bold text-slate-600 text-sm leading-relaxed">
                             {selectedUser.medicalConditions || 'No significant history reported.'}
                          </p>
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Allergies & Restrictions</h4>
                          <p className="bg-slate-50 p-6 rounded-3xl border border-slate-100 font-bold text-slate-600 text-sm leading-relaxed">
                             {selectedUser.allergies || 'No allergies recorded.'}
                          </p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                          <div className="relative z-10 space-y-8">
                             <div className="flex items-center gap-3">
                                <Activity className="text-emerald-500" size={24} />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Holistic Performance</h4>
                             </div>
                             <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                   <p className="text-6xl font-black tracking-tighter">{selectedUser.bmi || '--'}</p>
                                   <p className="text-emerald-400 font-black uppercase text-[10px] tracking-[0.2em]">{selectedUser.bmiCategory || 'STATUS PENDING'}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Activity</p>
                                   <p className="text-sm font-black uppercase text-white mt-1">{selectedUser.activityLevel || 'MODERATE'}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 flex items-center justify-between">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Dietary Preference</p>
                             <p className="text-lg font-black text-emerald-900">{selectedUser.dietaryPreferences || 'Standard'}</p>
                          </div>
                          <Leaf size={32} className="text-emerald-200" />
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex flex-col sm:flex-row gap-4 pt-6 shrink-0">
                    <a href={`mailto:${selectedUser.email}`} className="flex-1 flex items-center justify-center gap-3 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
                       <Mail size={18} /> Send Medical Report
                    </a>
                    <a href={`tel:${selectedUser.phone}`} className="flex-1 flex items-center justify-center gap-3 py-6 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black text-xs uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all">
                       <Phone size={18} /> Emergency Contact
                    </a>
                 </div>

              </div>
           </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowLogoutDialog(false)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Sign Out</h3>
            <p className="text-slate-500 font-medium mb-8">Are you sure you want to log out of your account?</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
