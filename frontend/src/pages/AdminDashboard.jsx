import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layout, Users, ShieldAlert, FileText, CheckCircle, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { 
    user, adminStats, adminUsersList, approveKyc, crops, 
    deleteCropListing, complaints, resolveComplaint 
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  // Resolution text state
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'admin') navigate(`/dashboard/${user.role}`);
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  // Compute stats locally if API fails/offline
  const totalFarmers = adminUsersList.filter(u => u.role === 'farmer').length || 4;
  const totalBuyers = adminUsersList.filter(u => u.role === 'customer' || u.role === 'retailer').length || 8;
  const pendingKycUsers = adminUsersList.filter(u => u.role === 'farmer' && u.kyc_status === 'pending');

  // Mock charts fallback data
  const monthlySales = adminStats?.monthly_sales || [
    { month: "Jan", sales: 120000 },
    { month: "Feb", sales: 180000 },
    { month: "Mar", sales: 220000 },
    { month: "Apr", sales: 195000 },
    { month: "May", sales: 280000 },
    { month: "Jun", sales: 320000 }
  ];

  const userGrowth = adminStats?.user_growth || [
    { month: "Jan", farmers: 10, buyers: 25 },
    { month: "Feb", farmers: 18, buyers: 40 },
    { month: "Mar", farmers: 27, buyers: 62 },
    { month: "Apr", farmers: 39, buyers: 95 },
    { month: "May", farmers: 55, buyers: 130 },
    { month: "Jun", farmers: totalFarmers + 10, buyers: totalBuyers + 30 }
  ];

  const handleKycAction = async (userId, action) => {
    try {
      await approveKyc(userId, action);
      alert(`User KYC profile set to ${action}!`);
    } catch (err) {
      alert("Failed to update KYC status.");
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    try {
      await resolveComplaint(selectedCompId, resolutionText);
      alert("Complaint resolved successfully!");
      setSelectedCompId(null);
      setResolutionText('');
    } catch (err) {
      alert("Resolution submission failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-left flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-2 flex-shrink-0">
        <div className="glass-card p-4 border-slate-100 dark:border-dark-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center font-bold text-primary-750">
            ⚙️
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white capitalize">{user.username}</h3>
            <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 px-2 py-0.5 rounded-full font-bold uppercase">Administrator</span>
          </div>
        </div>

        <div className="glass-card border-slate-100 dark:border-dark-800 overflow-hidden py-2 flex flex-col">
          {[
            { id: 'overview', label: 'Platform Stats', icon: <Layout size={16} /> },
            { id: 'kyc-approvals', label: 'Farmer KYC Panel', icon: <ShieldCheck size={16} /> },
            { id: 'moderation', label: 'Moderate Crops', icon: <ShieldAlert size={16} /> },
            { id: 'complaints', label: 'Support Tickets', icon: <FileText size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 border-l-4 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 w-full">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4 border-slate-100 dark:border-dark-800 shadow-sm text-center">
                <span className="text-[10px] text-slate-450 uppercase font-bold">Total Farmers</span>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{totalFarmers}</p>
              </div>
              <div className="glass-card p-4 border-slate-100 dark:border-dark-800 shadow-sm text-center">
                <span className="text-[10px] text-slate-455 uppercase font-bold">Active Buyers</span>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{totalBuyers}</p>
              </div>
              <div className="glass-card p-4 border-slate-100 dark:border-dark-800 shadow-sm text-center">
                <span className="text-[10px] text-slate-455 uppercase font-bold">Total Crops Listed</span>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{crops.length}</p>
              </div>
              <div className="glass-card p-4 border-slate-100 dark:border-dark-800 shadow-sm text-center">
                <span className="text-[10px] text-slate-455 uppercase font-bold">Pending KYC Files</span>
                <p className="text-xl font-extrabold text-amber-600 mt-1">{pendingKycUsers.length}</p>
              </div>
            </div>

            {/* Charts Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue bar chart */}
              <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-xs">Gross Platform Sales Trend (₹)</h4>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User onboarding growth curves */}
              <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-xs">Network User Onboarding Curves</h4>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="farmers" name="Farmers" stroke="#22c55e" strokeWidth={2.5} />
                      <Line type="monotone" dataKey="buyers" name="Buyers" stroke="#f59e0b" strokeWidth={2.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KYC APPROVALS PANEL */}
        {activeTab === 'kyc-approvals' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-1.5"><ShieldCheck size={20} className="text-primary-600" /> Farmers KYC Document Submissions</h3>
            
            {pendingKycUsers.length > 0 ? (
              <div className="flex flex-col gap-4">
                {pendingKycUsers.map(farmer => (
                  <div key={farmer.id} className="p-4 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white capitalize">{farmer.username}</h4>
                      <p className="text-slate-450 mt-1">Email: <strong>{farmer.email}</strong> • Region: <strong>{farmer.district}, {farmer.state}</strong></p>
                      <div className="flex flex-wrap gap-3 mt-2 font-bold text-[10px] text-slate-500 uppercase">
                        <span>Aadhaar: {farmer.kyc_docs?.aadhaar || "Pending"}</span>
                        <span>PAN: {farmer.kyc_docs?.pan || "Pending"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleKycAction(farmer.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/15 text-red-650 font-bold rounded-lg transition-all flex items-center gap-1"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button
                        onClick={() => handleKycAction(farmer.id, 'verified')}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-950/15 text-green-650 font-bold rounded-lg transition-all flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> Approve Verified
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic">No farmers are currently waiting for KYC verification approvals.</p>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCT MODERATION */}
        {activeTab === 'moderation' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4">Moderate Crops Catalog</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crops.map(crop => (
                <div key={crop.id} className="p-3 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <img src={crop.image_url} alt={crop.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-white">{crop.title}</h4>
                    <p className="text-slate-400 mt-0.5">Farmer: {crop.farmer_username} • Rate: ₹{crop.price_per_kg}/kg</p>
                  </div>
                  <button
                    onClick={() => deleteCropListing(crop.id)}
                    className="text-red-500 hover:text-red-600 font-bold hover:underline"
                  >
                    Delete Listing
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COMPLAINTS resolution */}
        {activeTab === 'complaints' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-850 dark:text-white">User Support complaints</h3>
              <p className="text-xs text-slate-450 mt-0.5">Resolve dispute tickets between consumers, retailers, and farmers.</p>
            </div>

            <div className="flex flex-col gap-4">
              {complaints.map(comp => (
                <div key={comp.id} className="p-4 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex flex-col gap-3 text-xs text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">{comp.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      comp.status === 'resolved' ? 'bg-green-150 text-green-800 dark:bg-green-950/20' : 'bg-red-150 text-red-800 dark:bg-red-950/20'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 leading-normal">Description: {comp.description}</p>
                  
                  <div className="text-[10px] text-slate-400 flex justify-between items-center border-t border-slate-150 dark:border-dark-800 pt-2">
                    <span>Submitted by: <strong>{comp.user_name} ({comp.user_role})</strong></span>
                    {comp.status === 'open' ? (
                      <button
                        onClick={() => setSelectedCompId(comp.id)}
                        className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
                      >
                        Resolve Ticket
                      </button>
                    ) : (
                      <span className="italic">Resolution: {comp.resolution}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Resolve Drawer Modal dialog */}
            {selectedCompId && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-left animate-in zoom-in-95 duration-200">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Submit Ticket Resolution</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Complaint ID: #{selectedCompId}</p>

                  <form onSubmit={handleResolveSubmit} className="flex flex-col gap-4 mt-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-450 uppercase mb-1.5">Resolution Text</label>
                      <textarea
                        rows="3"
                        required
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                        className="glass-input w-full text-xs resize-none"
                        placeholder="Write actions taken, refunds processed, or schedules resolved..."
                      />
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                      <button 
                        type="button" 
                        onClick={() => setSelectedCompId(null)}
                        className="btn-secondary py-2 px-4 text-xs font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn-primary py-2 px-5 text-xs font-semibold rounded-xl"
                      >
                        Submit Resolve
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
