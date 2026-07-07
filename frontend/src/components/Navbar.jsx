import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sun, Moon, ShoppingCart, User as UserIcon, Menu, X, LogOut, Layout, BookOpen, ShieldAlert, Languages } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme, user, logout, cart, lang, setLang } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="glass-nav sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🌱</span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
              KrishiConnect <span className="text-slate-800 dark:text-white">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Marketplace
            </Link>
            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              About Us
            </Link>
            <Link to="/stories" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Success Stories
            </Link>
            <Link to="/faq" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              FAQ
            </Link>
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Languages size={18} />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
              >
                <option value="en" className="dark:bg-dark-900">EN</option>
                <option value="te" className="dark:bg-dark-900">తెలుగు</option>
                <option value="hi" className="dark:bg-dark-900">हिंदी</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100/50 dark:hover:bg-dark-800/50 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Shopping Cart (Customer / Retailer / Guest) */}
            {(!user || user.role === 'customer' || user.role === 'retailer') && (
              <Link 
                to="/cart" 
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100/50 dark:hover:bg-dark-800/50 transition-colors relative"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile / Dashboard Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-dark-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 rounded-xl hover:bg-slate-100/30 dark:hover:bg-dark-800/30 transition-all"
                >
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-700 dark:text-primary-400 text-xs font-bold uppercase">
                    {user.username[0]}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{user.username}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-800 shadow-xl rounded-2xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-dark-800/50">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Logged in as</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{user.role}</p>
                    </div>
                    
                    <Link 
                      to={`/dashboard/${user.role}`} 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-800/40 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Layout size={16} />
                      Dashboard
                    </Link>

                    {user.role === 'farmer' && user.kyc_status !== 'verified' && (
                      <Link 
                        to="/kyc-verification" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                      >
                        <ShieldAlert size={16} />
                        Verify KYC
                      </Link>
                    )}

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-4 text-sm font-semibold rounded-xl">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-950 border-b border-slate-100 dark:border-dark-800 py-4 px-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 font-semibold py-1">
              Marketplace
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 font-semibold py-1">
              About Us
            </Link>
            <Link to="/stories" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 font-semibold py-1">
              Success Stories
            </Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 font-semibold py-1">
              FAQ
            </Link>

            <hr className="border-slate-100 dark:border-dark-800" />
            
            {/* Language Selection */}
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">Language</span>
              <select 
                value={lang} 
                onChange={(e) => { setLang(e.target.value); setMobileMenuOpen(false); }}
                className="bg-transparent border border-slate-200 dark:border-dark-800 rounded-lg px-2 py-1 text-sm font-semibold"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            {(!user || user.role === 'customer' || user.role === 'retailer') && (
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-slate-700 dark:text-slate-200 font-semibold py-1">
                <span>Shopping Cart</span>
                {cartCount > 0 && <span className="bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
              </Link>
            )}

            {user ? (
              <>
                <Link to={`/dashboard/${user.role}`} onClick={() => setMobileMenuOpen(false)} className="text-primary-600 dark:text-primary-400 font-bold py-1">
                  My Dashboard ({user.username})
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-left py-1">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary py-2.5">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
