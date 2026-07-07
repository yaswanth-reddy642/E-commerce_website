import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Users, TrendingUp, Cpu, ShoppingBag, ShieldCheck, Truck, ChevronRight, Award, Quote } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ farmers: 0, revenue: 0, orders: 0 });

  // Simple statistics count-up animation simulation
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        farmers: Math.floor((5420 / steps) * step),
        revenue: Math.floor((48200000 / steps) * step),
        orders: Math.floor((12840 / steps) * step),
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats({ farmers: 5420, revenue: 48200000, orders: 12840 });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Sprout className="text-primary-600 dark:text-primary-400" size={24} />,
      title: "Direct Farmer-to-Consumer Sales",
      desc: "Farmers skip middlemen, gaining 20-30% higher profits. Customers receive fresh products direct from harvesting fields."
    },
    {
      icon: <Cpu className="text-primary-600 dark:text-primary-400" size={24} />,
      title: "AI Crop Health & Soil Advisory",
      desc: "Instant soil-based crop matching recommendations and camera-based crop leaf disease diagnostics with treatment suggestions."
    },
    {
      icon: <ShieldCheck className="text-primary-600 dark:text-primary-400" size={24} />,
      title: "Secure Bulk Negotiations",
      desc: "A built-in contract negotiation module for retailers and wholesalers to request bulk discounts directly from farm sellers."
    },
    {
      icon: <Truck className="text-primary-600 dark:text-primary-400" size={24} />,
      title: "Efficient Traceable Logistics",
      desc: "Integrated logistics tracking from village centers to city warehouses, reducing transit waste and carbon footprint."
    }
  ];

  const steps = [
    { number: "01", title: "Farmer Lists Crop", desc: "Farmer uploads yield details, price per kg, images, and minimum bulk orders." },
    { number: "02", title: "AI Validates Price", desc: "Our price forecasting model evaluates local demand trends to recommend rates." },
    { number: "03", title: "Direct Purchase / Deal", desc: "Wholesalers negotiate bulk discounts while consumers buy directly via cart." },
    { number: "04", title: "Escrow Payment & Transit", desc: "Payment is safely escrowed via Razorpay until cargo delivery matches sample checks." }
  ];

  const stories = [
    {
      name: "Ramesh Kurapati",
      location: "Guntur, AP",
      achievement: "Increased revenue by 35% selling Red Chili",
      quote: "Before KrishiConnect, I sold my Teja chilies to local agents for ₹130/kg. Listing it directly let me close wholesale deals at ₹185/kg!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Anil Sandhu",
      location: "Ludhiana, Punjab",
      achievement: "Sold 12 Tons Basmati Paddy",
      quote: "The AI disease diagnostics helped me spot Rice Blast early. I sprayed the recommended fungicide immediately, saving my entire paddy acreage.",
      image: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[400px] left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 flex flex-col gap-6 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/40 rounded-full text-xs font-semibold text-primary-800 dark:text-primary-400 w-fit"
          >
            <Award size={14} /> National Smart Agriculture Winner 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight"
          >
            Empowering Farmers.<br />
            <span className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
              AI-Driven Marketplace.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
          >
            KrishiConnect AI is India's premium digital platform connecting farmers directly to retail, wholesale, and consumer markets. Driven by AI crop recommenders, diagnostic scans, and secure online negotiations.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-2"
          >
            <Link to="/marketplace" className="btn-primary w-full sm:w-auto px-8 py-3.5">
              Explore Marketplace <ChevronRight size={18} />
            </Link>
            <Link to="/register" className="btn-secondary w-full sm:w-auto px-8 py-3.5 border border-slate-200 dark:border-dark-800 hover:border-primary-500/40 dark:hover:border-primary-500/40">
              Join as Farmer / Buyer
            </Link>
          </motion.div>
        </div>

        {/* Hero Vector / Interactive Card Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full max-w-lg"
        >
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-2xl relative overflow-hidden animate-float">
            <div className="absolute top-0 right-0 bg-primary-500/10 px-4 py-1.5 rounded-bl-2xl text-xs font-bold text-primary-600 dark:text-primary-400">
              Live Auction Panel
            </div>
            
            {/* Mock Listing Details */}
            <div className="flex gap-4 items-center">
              <img 
                src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=150&q=80" 
                alt="Teja Chili" 
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="text-left">
                <span className="badge-green">Spices</span>
                <h3 className="font-bold text-slate-800 dark:text-white text-base mt-1">Guntur Teja Red Chili</h3>
                <p className="text-xs text-slate-400">Sold by Ramesh Kurapati (Guntur)</p>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-dark-800/50 my-4" />

            <div className="grid grid-cols-3 gap-2 text-left mb-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Price</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">₹185/kg</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Min Bulk</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">50 kg</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">AI Forecast</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">📈 Bullish</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-dark-950/40 p-4 rounded-xl text-left border border-slate-100 dark:border-dark-800/40">
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 font-bold text-xs">
                <Cpu size={14} /> AI Soil matching check:
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                NPK (140, 60, 80) and pH 6.8 is <strong>92% matching</strong> Guntur soil profiles for red pepper capsicums.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-slate-100 dark:bg-dark-900/40 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-1">
            <Users size={32} className="text-primary-600 dark:text-primary-400 mb-2" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{stats.farmers.toLocaleString()}+</h2>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Farmers Onboarded</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TrendingUp size={32} className="text-primary-600 dark:text-primary-400 mb-2" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">₹{(stats.revenue / 10000000).toFixed(1)} Cr+</h2>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue Generated</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShoppingBag size={32} className="text-primary-600 dark:text-primary-400 mb-2" />
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{stats.orders.toLocaleString()}+</h2>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Direct Orders Completed</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Why Agriculture Trades with KrishiConnect AI
          </h2>
          <p className="text-slate-500 mt-3">
            An ecosystem designed to reduce agricultural supply wastage, increase farmer profitability, and utilize AI diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -6 }}
              className="glass-card p-6 border-slate-100 dark:border-dark-850 hover:shadow-lg text-left"
            >
              <div className="p-3 bg-primary-100 dark:bg-primary-950/30 rounded-xl w-fit mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100 dark:bg-dark-900/40 py-20 md:py-32 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Transparent Farm-to-Gate Workflow
            </h2>
            <p className="text-slate-500 mt-3">
              How our online smart marketplace ensures quality checking and direct transaction fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col gap-3 text-left relative">
                <span className="text-5xl font-black text-primary-200 dark:text-dark-800">{s.number}</span>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg mt-1">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Success Stories from Our Fields
          </h2>
          <p className="text-slate-500 mt-3">
            Real stories from farmers who have unlocked the potential of tech-enabled direct sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stories.map((st, i) => (
            <div key={i} className="glass-card p-8 border-slate-100 dark:border-dark-800 text-left flex flex-col justify-between gap-6 relative">
              <Quote className="absolute top-6 right-6 text-primary-100 dark:text-dark-800" size={48} />
              <p className="text-slate-600 dark:text-slate-300 italic text-base leading-relaxed relative z-10">
                "{st.quote}"
              </p>
              <div className="flex items-center gap-4 border-t border-slate-100 dark:border-dark-800 pt-4">
                <img src={st.image} alt={st.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{st.name}</h4>
                  <p className="text-xs text-slate-400">{st.location} • <span className="text-primary-600 dark:text-primary-400 font-semibold">{st.achievement}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[50px] -z-1" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Start Smarter Agricultural Trading Today</h2>
          <p className="max-w-xl mx-auto text-primary-100 mb-8 leading-relaxed">
            Register your farm listings, test crop diseases with AI scans, or procure bulk grains at fair prices. Connect to our network today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-750 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 shadow-md transition-all active:scale-95">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
