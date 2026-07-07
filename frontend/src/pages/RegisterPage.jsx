import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserPlus, User as UserIcon, Mail, Phone, Lock, Map, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [state, setState] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const states = ['Andhra Pradesh', 'Punjab', 'Karnataka', 'Telangana', 'Maharashtra', 'Delhi'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerUser({
        username,
        email,
        phone,
        password,
        role,
        state,
        district
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || "Registration failed. Try a different username or email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[85vh] flex items-center justify-center text-left">
      <div className="w-full max-w-lg glass-card p-8 border-slate-100 dark:border-dark-800 shadow-xl">
        <div className="text-center mb-6">
          <span className="text-3xl">🌱</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-2">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join the digital agriculture ecosystem</p>
        </div>

        {success ? (
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <CheckCircle className="text-primary-600 animate-bounce" size={48} />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">Registered Successfully!</h3>
            <p className="text-xs text-slate-450">Redirecting you to the login screen to verify credentials...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">I want to join as a:</label>
              <div className="grid grid-cols-3 gap-2">
                {['customer', 'farmer', 'retailer'].map(roleVal => (
                  <button
                    key={roleVal}
                    type="button"
                    onClick={() => setRole(roleVal)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      role === roleVal
                        ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
                        : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {roleVal === 'customer' ? 'Consumer' : roleVal === 'farmer' ? 'Farmer' : 'Wholesaler'}
                  </button>
                ))}
              </div>
            </div>

            {/* Two column fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="glass-input pl-10 w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={14} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="glass-input pl-10 w-full text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 text-slate-400" size={14} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contact number"
                    className="glass-input pl-10 w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={14} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="glass-input pl-10 w-full text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Location fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="glass-input w-full text-xs bg-white dark:bg-dark-900"
                >
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">District / Region</label>
                <div className="relative">
                  <Map className="absolute left-3.5 top-3 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Enter district name"
                    className="glass-input pl-10 w-full text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 rounded-xl w-full font-bold mt-2 text-sm"
            >
              {loading ? "Registering..." : "Create Account"} <UserPlus size={16} />
            </button>

            <p className="text-xs text-center text-slate-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
