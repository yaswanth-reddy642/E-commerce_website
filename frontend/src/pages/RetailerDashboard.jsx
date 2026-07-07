import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingBag, TrendingUp, Sparkles, MapPin, CheckCircle, Clock, ShieldAlert, FileText } from 'lucide-react';

export default function RetailerDashboard() {
  const { user, negotiations, updateNegotiationStatus, crops } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('negotiations');

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'retailer') navigate(`/dashboard/${user.role}`);
  }, [user]);

  if (!user || user.role !== 'retailer') return null;

  // Filter negotiations initiated by this retailer
  const retailerNegs = negotiations.filter(n => n.retailer_id === user.id);

  // Compute analytics data (savings on accepted negotiations)
  const acceptedNegs = retailerNegs.filter(n => n.status === 'accepted');
  const totalSavings = acceptedNegs.reduce((sum, neg) => {
    const originalCrop = crops.find(c => c.id === neg.crop_id);
    const origPrice = originalCrop ? originalCrop.price_per_kg : neg.proposed_price + 3;
    const diff = origPrice - neg.proposed_price;
    return sum + (diff * neg.proposed_quantity);
  }, 0);

  const analyticsData = acceptedNegs.map(neg => {
    const originalCrop = crops.find(c => c.id === neg.crop_id);
    const origPrice = originalCrop ? originalCrop.price_per_kg : neg.proposed_price + 3;
    const diff = origPrice - neg.proposed_price;
    return {
      crop: neg.crop_title.substring(0, 8) + '...',
      spent: neg.proposed_quantity * neg.proposed_price,
      saved: Math.max(diff * neg.proposed_quantity, 0)
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-left flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-2 flex-shrink-0">
        <div className="glass-card p-4 border-slate-100 dark:border-dark-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center font-bold text-primary-750">
            🏪
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white capitalize">{user.username}</h3>
            <span className="text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded-full font-bold uppercase">Wholesaler</span>
          </div>
        </div>

        <div className="glass-card border-slate-100 dark:border-dark-800 overflow-hidden py-2 flex flex-col">
          <button
            onClick={() => setActiveTab('negotiations')}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left transition-all ${
              activeTab === 'negotiations'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 border-l-4 border-primary-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800/20'
            }`}
          >
            <TrendingUp size={16} />
            Bulk Deals
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left transition-all ${
              activeTab === 'savings'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 border-l-4 border-primary-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800/20'
            }`}
          >
            <Sparkles size={16} />
            Savings Analytics
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 w-full">
        {/* TAB 1: NEGOTIATIONS LIST */}
        {activeTab === 'negotiations' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4">Volume Discount Contracts</h3>
            
            {retailerNegs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {retailerNegs.map(neg => (
                  <div key={neg.id} className="p-4 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-orange">Negotiation ID: #{neg.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          neg.status === 'accepted' ? 'bg-green-100 text-green-800' : neg.status === 'countered' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {neg.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{neg.crop_title}</h4>
                      <p className="text-slate-450 mt-1">Proposed quantity: <strong>{neg.proposed_quantity} kg</strong></p>
                      <p className="text-slate-500 italic mt-1 bg-white dark:bg-dark-900/50 p-2 rounded border border-slate-100 dark:border-dark-850">
                        "{neg.message}"
                      </p>
                    </div>

                    <div className="text-right flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                      <div>
                        <span className="text-slate-400">Proposed Rate:</span>
                        <p className="text-lg font-black text-slate-800 dark:text-slate-100">₹{neg.proposed_price}/kg</p>
                      </div>

                      {/* If Countered by farmer, Retailer can accept or decline */}
                      {neg.status === 'countered' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateNegotiationStatus(neg.id, { status: 'rejected' })}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/15 text-red-650 font-bold rounded-lg transition-all"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => updateNegotiationStatus(neg.id, { status: 'accepted' })}
                            className="px-3 py-1 bg-green-50 hover:bg-green-100 dark:bg-green-950/15 text-green-650 font-bold rounded-lg transition-all"
                          >
                            Accept Deal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic">No wholesale negotiations initiated yet. Go to marketplace and click 'Negotiate Price' on bulk listings.</p>
            )}
          </div>
        )}

        {/* TAB 2: SAVINGS ANALYTICS */}
        {activeTab === 'savings' && (
          <div className="flex flex-col gap-6">
            {/* Stat Box */}
            <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-450 font-bold uppercase">Estimated Bulk Savings</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">₹{totalSavings.toLocaleString()}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Acquired volume discounts on direct farm-gate orders</p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-950 text-primary-600 rounded-xl">
                <Sparkles size={24} />
              </div>
            </div>

            {/* Savings Bar Chart */}
            <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Wholesale Procurement Expenses (₹)</h4>
              <div className="h-64">
                {analyticsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="crop" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="spent" name="Spent Amount (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="saved" name="Saved Amount (₹)" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-450 italic">
                    No accepted contract deals to analyze. Procure crops using bulk negotiation options.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
