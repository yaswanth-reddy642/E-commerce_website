import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Layout, PlusCircle, Leaf, ShieldAlert, Cpu, 
  TrendingUp, IndianRupee, Wheat, CheckSquare, 
  MapPin, Send, Upload, Heart, ChevronRight, HelpCircle
} from 'lucide-react';

export default function FarmerDashboard() {
  const { 
    user, crops, orders, addCropListing, deleteCropListing, 
    updateNegotiationStatus, negotiations, api, lang, setLang 
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  // Redirection guard
  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'farmer') navigate(`/dashboard/${user.role}`);
  }, [user]);

  // Add Crop Form States
  const [cropTitle, setCropTitle] = useState('');
  const [cropDesc, setCropDesc] = useState('');
  const [cropCat, setCropCat] = useState('grains');
  const [cropPrice, setCropPrice] = useState('');
  const [cropMinBulk, setCropMinBulk] = useState('50');
  const [cropQty, setCropQty] = useState('');
  const [cropImg, setCropImg] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // AI Diagnostic states
  const [leafFile, setLeafFile] = useState(null);
  const [leafDiag, setLeafDiag] = useState(null);
  const [leafLoading, setLeafLoading] = useState(false);

  // AI Soil Recommender Form states
  const [soilType, setSoilType] = useState('Black');
  const [nitrogen, setNitrogen] = useState(80);
  const [phosphorous, setPhosphorous] = useState(45);
  const [potassium, setPotassium] = useState(50);
  const [ph, setPh] = useState(6.5);
  const [rainfall, setRainfall] = useState(900);
  const [temp, setTemp] = useState(28);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [recommendLoading, setRecommendLoading] = useState(false);

  // Chatbot states
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hello! I am your KrishiConnect AI farming advisor. Ask me anything about pest controls, organic fertilizers, or PM-KISAN schemes.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  if (!user || user.role !== 'farmer') return null;

  // Filter farmer crops
  const farmerCrops = crops.filter(c => c.farmer_id === user.id);
  
  // Calculate farmer sales
  const farmerOrders = orders.filter(o => o.seller_id === user.id);
  const totalSales = farmerOrders.reduce((sum, o) => o.payment_status === 'paid' ? sum + o.total_price : sum, 0);

  // Seed chart data using completed orders
  const weeklySalesData = [
    { name: 'Wk 1', sales: totalSales * 0.15 || 8000 },
    { name: 'Wk 2', sales: totalSales * 0.20 || 12000 },
    { name: 'Wk 3', sales: totalSales * 0.25 || 15000 },
    { name: 'Wk 4', sales: totalSales * 0.40 || totalSales || 24000 }
  ];

  const cropInventoryData = farmerCrops.map(c => ({
    name: c.title.substring(0, 10) + '...',
    stock: c.quantity_available
  }));

  // Handle Add Crop submit
  const handleAddCropSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCropListing({
        title: cropTitle,
        description: cropDesc,
        category: cropCat,
        price_per_kg: parseFloat(cropPrice),
        min_bulk_order: parseFloat(cropMinBulk),
        quantity_available: parseFloat(cropQty),
        image_url: cropImg || undefined
      });
      setAddSuccess(true);
      setCropTitle('');
      setCropDesc('');
      setCropPrice('');
      setCropQty('');
      setCropImg('');
      setTimeout(() => {
        setAddSuccess(false);
        setActiveTab('overview');
      }, 2000);
    } catch (err) {
      alert("Failed to list crop. Verify you have verified KYC.");
    }
  };

  // Simulate Leaf Diagnosis
  const handleLeafScan = async (e) => {
    e.preventDefault();
    if (!leafFile) return;

    setLeafLoading(true);
    setLeafDiag(null);

    // Call API or fall back to simulated diagnostics
    try {
      const formData = new FormData();
      formData.append('file', leafFile);
      const res = await api.post('/api/ai/diagnose', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLeafDiag(res.data);
    } catch (err) {
      // Fallback diagnostics simulator locally
      setTimeout(() => {
        const fn = leafFile.name.toLowerCase();
        let result = {
          disease_name: "Healthy Crop Leaf (No Pathogens)",
          confidence: 0.95,
          treatment_suggestions: ["Continue Scheduled organic manure application."],
          preventative_measures: ["Keep leaf surfaces aerated. Maintain drip lines."],
          severity: "Low"
        };

        if (fn.includes("tomato") || fn.includes("blight")) {
          result = {
            disease_name: "Tomato Late Blight (Phytophthora infestans)",
            confidence: 0.92,
            treatment_suggestions: [
              "Spray Mancozeb fungicide (2g per Litre of water) immediately.",
              "Prune and destroy infected lower foliage.",
              "Transition to drip irrigation to keep canopy dry."
            ],
            preventative_measures: [
              "Sow certified blight resistant seeds (e.g. Arka Rakshak).",
              "Maintain 60x45cm plant spacing.",
              "Apply mulching to restrict soil-borne splashback."
            ],
            severity: "High"
          };
        } else if (fn.includes("rice") || fn.includes("paddy") || fn.includes("blast")) {
          result = {
            disease_name: "Rice Blast (Magnaporthe oryzae)",
            confidence: 0.89,
            treatment_suggestions: [
              "Foliar spray of Tricyclazole 75 WP (0.6g/L of water).",
              "Suspend nitrogenous top-dressing temporarily."
            ],
            preventative_measures: [
              "Treat seeds with Carbendazim (2g/kg).",
              "Burn previous crop stubbles post-harvest."
            ],
            severity: "High"
          };
        } else if (fn.includes("cotton") || fn.includes("leaf")) {
          result = {
            disease_name: "Cotton Leaf Curl Virus (CLCuD)",
            confidence: 0.87,
            treatment_suggestions: [
              "Spray Neem Oil (1500 ppm) to control whitefly vector insects.",
              "Apply foliar spray of potassium nitrate to boost crop defense."
            ],
            preventative_measures: [
              "Plant ICAR certified disease resistant hybrids.",
              "Set up yellow sticky traps (15 traps per acre)."
            ],
            severity: "Medium"
          };
        }
        
        setLeafDiag(result);
        setLeafLoading(false);
      }, 1500);
    }
  };

  // Soil matching request
  const handleSoilRecommend = async (e) => {
    e.preventDefault();
    setRecommendLoading(true);
    setRecommendationResult(null);

    try {
      const res = await api.post('/api/ai/recommend', {
        location: user.district,
        soil_type: soilType,
        nitrogen: parseFloat(nitrogen),
        phosphorous: parseFloat(phosphorous),
        potassium: parseFloat(potassium),
        ph_level: parseFloat(ph),
        rainfall: parseFloat(rainfall),
        temperature: parseFloat(temp)
      });
      setRecommendationResult(res.data);
    } catch (err) {
      // Local fallback simulator
      setTimeout(() => {
        setRecommendationResult({
          recommended_crops: [
            {
              crop_name: soilType === 'Black' ? "Bt Cotton (Hybrid)" : "Premium Paddy",
              confidence: 0.91,
              estimated_yield: soilType === 'Black' ? "2.4 Tons/Hectare" : "4.8 Tons/Hectare",
              suitable_seasons: ["Kharif (June - October)"],
              market_demand: "High",
              reasoning: `Your soil texture (${soilType}) and temperature (${temp}°C) are highly matching typical regional Guntur standards.`
            }
          ],
          soil_analysis: "NPK ratios are normal. Maintain standard compost rotation.",
          general_tips: ["Apply organic FYM manure during primary tillage."]
        });
        setRecommendLoading(false);
      }, 1200);
    } finally {
      setRecommendLoading(false);
    }
  };

  // Chat message submit
  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;

    const userText = chatMsg;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setChatMsg('');
    setChatLoading(true);

    try {
      const res = await api.post('/api/ai/chat', { message: userText, language: lang });
      setChatHistory(prev => [...prev, { role: 'bot', text: res.data.response }]);
    } catch (err) {
      // Fallback offline responses
      setTimeout(() => {
        let reply = "Advisor bot: I recommend checking Guntur Chili crop advisories. Spray neem oil to handle leaf sucking pests.";
        if (userText.toLowerCase().includes("scheme") || userText.toLowerCase().includes("subsidy")) {
          reply = "Government Schemes: \n1. PM-KISAN: ₹6000 annual direct cash transfers.\n2. PM Fasal Bima: Crop damage insurance.";
        }
        setChatHistory(prev => [...prev, { role: 'bot', text: reply }]);
        setChatLoading(false);
      }, 1000);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-left flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-2 flex-shrink-0">
        <div className="glass-card p-4 border-slate-100 dark:border-dark-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center font-bold text-primary-700 dark:text-primary-400">
            🌾
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white capitalize">{user.username}</h3>
            <span className="text-[10px] bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full font-bold uppercase">Farmer</span>
          </div>
        </div>

        <div className="glass-card border-slate-100 dark:border-dark-800 overflow-hidden py-2 flex flex-col">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: <Layout size={16} /> },
            { id: 'add-crop', label: 'Add Crop Listing', icon: <PlusCircle size={16} /> },
            { id: 'inventory', label: 'My Listings', icon: <Wheat size={16} /> },
            { id: 'orders', label: 'Sales Orders', icon: <CheckSquare size={16} /> },
            { id: 'ai-advisory', label: 'AI Soil Advisory', icon: <Cpu size={16} /> },
            { id: 'ai-diagnostics', label: 'AI Disease Diagnostic', icon: <Leaf size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setLeafDiag(null); }}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card p-6 border-slate-100 dark:border-dark-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold">Total Earnings</span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">₹{totalSales.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/40 rounded-xl text-green-600">
                  <IndianRupee size={22} />
                </div>
              </div>

              <div className="glass-card p-6 border-slate-100 dark:border-dark-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold">My Active Listings</span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{farmerCrops.length}</h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600">
                  <Wheat size={22} />
                </div>
              </div>

              <div className="glass-card p-6 border-slate-100 dark:border-dark-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold">Wholesale Requests</span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                    {negotiations.filter(n => n.farmer_id === user.id && n.status === 'pending').length}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
                  <TrendingUp size={22} />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Curve */}
              <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Weekly Sales Volume (₹)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklySalesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" stroke="#22c55e" fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Crop Yield Stocks Bar */}
              <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Listings Available Stocks (kg)</h4>
                <div className="h-64">
                  {cropInventoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cropInventoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="stock" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-450 italic">
                      No active listings. Go to the listings tab to add crops.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk Deals negotiations box */}
            <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
              <h4 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Wholesale Negotiation Proposals</h4>
              {negotiations.filter(n => n.farmer_id === user.id).length > 0 ? (
                <div className="flex flex-col gap-3">
                  {negotiations.filter(n => n.farmer_id === user.id).map(neg => (
                    <div key={neg.id} className="p-4 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div>
                        <span className="badge-orange mb-1.5 inline-block">Proposal ID: #{neg.id}</span>
                        <h5 className="font-bold text-slate-800 dark:text-white text-sm">{neg.crop_title}</h5>
                        <p className="text-slate-450 mt-1">Retailer: <strong>{neg.retailer_name}</strong> • Qty: <strong>{neg.proposed_quantity} kg</strong></p>
                        <p className="text-slate-500 italic mt-1 bg-white dark:bg-dark-900/50 p-2 rounded border border-slate-100 dark:border-dark-800">
                          "{neg.message}"
                        </p>
                      </div>

                      <div className="text-right flex flex-col sm:items-end gap-2.5 w-full sm:w-auto">
                        <div>
                          <span className="text-slate-400">Offer Rate:</span>
                          <p className="text-lg font-black text-slate-800 dark:text-slate-100">₹{neg.proposed_price}/kg</p>
                        </div>
                        {neg.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateNegotiationStatus(neg.id, { status: 'rejected' })}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/10 text-red-650 font-bold rounded-lg transition-all"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => updateNegotiationStatus(neg.id, { status: 'accepted' })}
                              className="px-3 py-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-950/10 text-green-650 font-bold rounded-lg transition-all"
                            >
                              Accept Deal
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            neg.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-950/30' : 'bg-red-105 text-red-800 dark:bg-red-950/30'
                          }`}>
                            {neg.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No incoming negotiations from wholesalers received yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD CROP */}
        {activeTab === 'add-crop' && (
          <div className="glass-card p-8 border-slate-100 dark:border-dark-800 shadow-sm max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
              <PlusCircle size={20} className="text-primary-600" /> List Fresh Harvest
            </h3>

            {addSuccess ? (
              <div className="text-center py-8">
                <span className="text-4xl">🎉</span>
                <h4 className="text-base font-bold text-primary-600 dark:text-primary-400 mt-2">Crop Listing Created!</h4>
                <p className="text-xs text-slate-450 mt-1">Customers can now view and purchase this yield in the marketplace.</p>
              </div>
            ) : (
              <form onSubmit={handleAddCropSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Crop / Product Title</label>
                  <input
                    type="text"
                    required
                    value={cropTitle}
                    onChange={(e) => setCropTitle(e.target.value)}
                    placeholder="e.g. Basmati Paddy (Pusa 1121)"
                    className="glass-input w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Category</label>
                    <select
                      value={cropCat}
                      onChange={(e) => setCropCat(e.target.value)}
                      className="glass-input w-full text-sm bg-white dark:bg-dark-900"
                    >
                      <option value="grains">Grains & Cereals</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="pulses">Pulses</option>
                      <option value="spices">Spices</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Price (₹ / kg)</label>
                    <input
                      type="number"
                      required
                      value={cropPrice}
                      onChange={(e) => setCropPrice(e.target.value)}
                      placeholder="Rate per kg"
                      className="glass-input w-full text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Yield Quantity (kg)</label>
                    <input
                      type="number"
                      required
                      value={cropQty}
                      onChange={(e) => setCropQty(e.target.value)}
                      placeholder="Total available stock"
                      className="glass-input w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Min Bulk Order Size (kg)</label>
                    <input
                      type="number"
                      required
                      value={cropMinBulk}
                      onChange={(e) => setCropMinBulk(e.target.value)}
                      placeholder="Minimum purchase unit"
                      className="glass-input w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Yield Image URL</label>
                  <input
                    type="url"
                    value={cropImg}
                    onChange={(e) => setCropImg(e.target.value)}
                    placeholder="https://images.unsplash.com/... (Optional)"
                    className="glass-input w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Description</label>
                  <textarea
                    rows="3"
                    value={cropDesc}
                    onChange={(e) => setCropDesc(e.target.value)}
                    placeholder="Describe harvest details, fertilizers used, grain features..."
                    className="glass-input w-full text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary py-3 rounded-xl font-bold text-sm w-full mt-2"
                >
                  Create Listing
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: MANAGE INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Active Crop Listings</h3>
            {farmerCrops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farmerCrops.map(crop => (
                  <div key={crop.id} className="p-4 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex items-center justify-between gap-4 text-xs">
                    <img src={crop.image_url} alt={crop.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{crop.title}</h4>
                      <p className="text-slate-450 mt-0.5">Price: ₹{crop.price_per_kg}/kg • Stock: {crop.quantity_available} kg</p>
                    </div>
                    <button
                      onClick={() => deleteCropListing(crop.id)}
                      className="text-red-500 hover:text-red-600 font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic">You have no active crop listings. Use the add listing tab to create one.</p>
            )}
          </div>
        )}

        {/* TAB 4: SALES ORDERS */}
        {activeTab === 'orders' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">My Sales History</h3>
            {farmerOrders.length > 0 ? (
              <div className="flex flex-col gap-4">
                {farmerOrders.map(order => (
                  <div key={order.id} className="p-4 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <span className="badge-green mb-1.5 inline-block">Order ID: #{order.id}</span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{order.items[0]?.crop_title}</h4>
                      <p className="text-slate-450 mt-1">Ordered quantity: <strong>{order.items[0]?.quantity} kg</strong></p>
                      <p className="text-slate-450 mt-0.5">Shipping to: <em>{order.delivery_address}</em></p>
                    </div>

                    <div className="text-right flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
                      <p className="text-lg font-black text-slate-850 dark:text-slate-100">₹{order.total_price}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        order.shipping_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.shipping_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-455 italic">No purchase orders placed on your listings yet.</p>
            )}
          </div>
        )}

        {/* TAB 5: AI SOIL ADVISORY */}
        {activeTab === 'ai-advisory' && (
          <div className="flex flex-col lg:flex-row gap-6 text-left">
            {/* Input Form */}
            <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm flex-1 w-full max-w-md">
              <h3 className="font-bold text-slate-850 dark:text-white mb-4 text-base flex items-center gap-1.5">
                <Cpu size={18} className="text-primary-600" /> Soil Analyzer Recommender
              </h3>
              <form onSubmit={handleSoilRecommend} className="flex flex-col gap-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1.5">Soil Texture</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="glass-input w-full text-xs bg-white dark:bg-dark-900"
                    >
                      <option value="Black">Black Soil</option>
                      <option value="Alluvial">Alluvial Soil</option>
                      <option value="Red">Red Soil</option>
                      <option value="Laterite">Laterite Soil</option>
                      <option value="Sandy">Sandy Loam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1.5">Soil pH Level</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={ph} 
                      onChange={(e) => setPh(e.target.value)} 
                      className="glass-input w-full text-xs" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1.5">Nitrogen (N)</label>
                    <input 
                      type="number" 
                      value={nitrogen} 
                      onChange={(e) => setNitrogen(e.target.value)} 
                      className="glass-input w-full text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1.5">Phosphor (P)</label>
                    <input 
                      type="number" 
                      value={phosphorous} 
                      onChange={(e) => setPhosphorous(e.target.value)} 
                      className="glass-input w-full text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1.5">Potass (K)</label>
                    <input 
                      type="number" 
                      value={potassium} 
                      onChange={(e) => setPotassium(e.target.value)} 
                      className="glass-input w-full text-xs" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1.5">Rainfall (mm/yr)</label>
                    <input 
                      type="number" 
                      value={rainfall} 
                      onChange={(e) => setRainfall(e.target.value)} 
                      className="glass-input w-full text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1.5">Temperature (°C)</label>
                    <input 
                      type="number" 
                      value={temp} 
                      onChange={(e) => setTemp(e.target.value)} 
                      className="glass-input w-full text-xs" 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={recommendLoading}
                  className="btn-primary py-2.5 rounded-xl font-bold w-full mt-2"
                >
                  {recommendLoading ? "Calculating soil matches..." : "Generate AI Recommendations"}
                </button>
              </form>
            </div>

            {/* Results / Chatbot advisor */}
            <div className="flex-1 flex flex-col gap-6 w-full">
              {/* Recommendations result */}
              {recommendationResult && (
                <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left animate-in slide-in-from-bottom duration-250">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">AI Crop Recommendations</h4>
                  <div className="flex flex-col gap-3">
                    {recommendationResult.recommended_crops.map((item, idx) => (
                      <div key={idx} className="p-3 bg-primary-50/35 dark:bg-primary-950/10 border border-primary-200/40 dark:border-primary-800/40 rounded-xl text-xs">
                        <div className="flex justify-between items-center">
                          <h5 className="font-extrabold text-sm text-primary-750 dark:text-primary-400">{item.crop_name}</h5>
                          <span className="badge-green">Match: {(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{item.reasoning}</p>
                        <p className="text-slate-450 mt-1">Expected yield: <strong>{item.estimated_yield}</strong> • Demand: <strong className="text-amber-600">{item.market_demand}</strong></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chatbot Window */}
              <div className="glass-card border-slate-100 dark:border-dark-800 shadow-sm flex-1 flex flex-col justify-between max-h-[500px]">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-dark-800/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Expert Farm Advisory Chatbot</h4>
                      <p className="text-[9px] text-slate-400">Online advisory system</p>
                    </div>
                  </div>

                  <select 
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-transparent border border-slate-200 dark:border-dark-800 rounded-lg text-[10px] font-bold px-2 py-0.5"
                  >
                    <option value="en">English</option>
                    <option value="te">తెలుగు</option>
                    <option value="hi">हिंदी</option>
                  </select>
                </div>

                {/* Messages Panel */}
                <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3 max-h-[300px]">
                  {chatHistory.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-normal ${
                        item.role === 'bot'
                          ? 'bg-slate-50 dark:bg-dark-950/50 text-slate-700 dark:text-slate-350 self-start border border-slate-150 dark:border-dark-800'
                          : 'bg-primary-600 text-white self-end'
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="bg-slate-50 dark:bg-dark-950/50 text-slate-450 p-3 rounded-2xl text-[10px] italic self-start animate-pulse">
                      Advisor is typing response...
                    </div>
                  )}
                </div>

                {/* Input panel */}
                <form onSubmit={handleChatSend} className="p-3 border-t border-slate-100 dark:border-dark-800/50 flex gap-2">
                  <input
                    type="text"
                    required
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    placeholder="Ask about fertilizer ratios, PM-KISAN, pests..."
                    className="glass-input flex-1 py-1.5 text-xs"
                  />
                  <button 
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-500 text-white p-2 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AI DISEASE DIAGNOSTICS */}
        {activeTab === 'ai-diagnostics' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-6 text-left">
            {/* Upload Selector */}
            <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-center">
              <Leaf className="text-primary-600 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-slate-850 dark:text-white text-base">Crop Health Leaf Diagnosis</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-normal">
                Upload or drag crop leaf photos to detect pathogens, receive organic/chemical spray advices, and predict damage scores.
              </p>

              <form onSubmit={handleLeafScan} className="flex flex-col gap-4 mt-6">
                <div className="border-2 border-dashed border-slate-200 dark:border-dark-800 hover:border-primary-400 dark:hover:border-primary-500/50 rounded-xl p-8 cursor-pointer bg-slate-50 dark:bg-dark-950/20 relative group transition-colors">
                  <input
                    type="file"
                    required
                    onChange={(e) => setLeafFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="text-slate-400 group-hover:text-primary-500 mx-auto mb-2 transition-colors" size={28} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">
                    {leafFile ? leafFile.name : "Select leaf image from device"}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Accepts JPG, PNG up to 5MB</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setLeafFile(new File([""], "tomato_blight_leaf.png")); }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 rounded-lg text-[10px] font-semibold transition-all"
                  >
                    🌱 Load Mock Tomato Leaf
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLeafFile(new File([""], "paddy_blast_leaf.png")); }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-700 rounded-lg text-[10px] font-semibold transition-all"
                  >
                    🌾 Load Mock Rice Leaf
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={leafLoading}
                  className="btn-primary py-2.5 rounded-xl font-bold max-w-xs mx-auto w-full"
                >
                  {leafLoading ? "Diagnosing pathology scan..." : "Start Health Scan"}
                </button>
              </form>
            </div>

            {/* Diagnostics result */}
            {leafDiag && (
              <div className="glass-card p-6 border-slate-105 dark:border-dark-800 shadow-sm animate-in zoom-in-95 duration-250">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-dark-800 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">SCAN RESULTS</span>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-base mt-0.5">{leafDiag.disease_name}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    leafDiag.severity === 'High' ? 'bg-red-100 text-red-800' : leafDiag.severity === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {leafDiag.severity} Severity
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div>
                    <h5 className="font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><HelpCircle size={14} className="text-amber-500" /> Treatment Advisory</h5>
                    <ul className="list-disc pl-4 flex flex-col gap-2 text-slate-600 dark:text-slate-350">
                      {leafDiag.treatment_suggestions.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><ShieldCheck size={14} className="text-green-500" /> Preventative Actions</h5>
                    <ul className="list-disc pl-4 flex flex-col gap-2 text-slate-600 dark:text-slate-350">
                      {leafDiag.preventative_measures.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
