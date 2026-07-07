import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, KeyRound, User as UserIcon, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, cart } = useApp();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await login(username, password);
      if (cart.length > 0 && (loggedUser.role === 'customer' || loggedUser.role === 'retailer')) {
        navigate('/cart');
      } else {
        navigate(`/dashboard/${loggedUser.role}`);
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (uname, pwd) => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await login(uname, pwd);
      if (cart.length > 0 && (loggedUser.role === 'customer' || loggedUser.role === 'retailer')) {
        navigate('/cart');
      } else {
        navigate(`/dashboard/${loggedUser.role}`);
      }
    } catch (err) {
      setError(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { name: "System Admin", username: "admin", password: "admin123", role: "admin", emoji: "⚙️" },
    { name: "Farmer (Ramesh)", username: "ramesh", password: "farmer123", role: "farmer", emoji: "👨‍🌾" },
    { name: "Farmer (Anil)", username: "anil", password: "farmer123", role: "farmer", emoji: "🌾" },
    { name: "Customer (Suresh)", username: "suresh", password: "buyer123", role: "customer", emoji: "🍎" },
    { name: "Wholesale Retailer (Harish)", username: "harish", password: "retailer123", role: "retailer", emoji: "🏪" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-12 text-left">
      {/* Login Form card */}
      <div className="w-full max-w-md glass-card p-8 border-slate-100 dark:border-dark-800 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-3xl">🌱</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to manage your farming marketplace account</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-3 rounded-xl text-xs font-semibold mb-4 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="glass-input pl-10 w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="glass-input pl-10 w-full text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 rounded-xl w-full font-bold mt-2"
          >
            {loading ? "Signing In..." : "Sign In"} <LogIn size={16} />
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>

      {/* Demo Credentials Switcher */}
      <div className="w-full max-w-md lg:max-w-lg flex flex-col gap-4 text-left">
        <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-md">
          <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 font-bold text-sm mb-3">
            <ShieldCheck size={18} /> Mock evaluation sandbox:
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            KrishiConnect AI includes ready-seeded databases for all user types. Tap any role below to bypass authentication and launch their customized dashboard interface instantly.
          </p>

          <div className="flex flex-col gap-2.5">
            {demoAccounts.map(demo => (
              <button
                key={demo.username}
                onClick={() => handleDemoLogin(demo.username, demo.password)}
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-primary-50 dark:bg-dark-950/40 dark:hover:bg-primary-950/20 border border-slate-200/40 hover:border-primary-400/40 dark:border-dark-800 rounded-xl transition-all text-xs text-slate-600 dark:text-slate-350"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{demo.emoji}</span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{demo.name}</span>
                    <span className="block text-[10px] text-slate-400 capitalize">Username: {demo.username} • Role: {demo.role}</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
