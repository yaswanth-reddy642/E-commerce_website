import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Send, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 dark:bg-dark-950 dark:border-t dark:border-dark-900 border-t border-slate-200 transition-colors duration-200">
      {/* Upper Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="font-extrabold text-xl text-white">
                KrishiConnect <span className="text-primary-500">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Connecting Indian farmers directly with buyers, wholesalers, and consumers. Empowering rural micro-entrepreneurs using AI-guided diagnostics and crop recommendations.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="h-9 w-9 bg-slate-800 dark:bg-dark-900 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-full flex items-center justify-center text-white transition-colors duration-200">
                <Facebook size={16} />
              </a>
              <a href="#" className="h-9 w-9 bg-slate-800 dark:bg-dark-900 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-full flex items-center justify-center text-white transition-colors duration-200">
                <Twitter size={16} />
              </a>
              <a href="#" className="h-9 w-9 bg-slate-800 dark:bg-dark-900 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-full flex items-center justify-center text-white transition-colors duration-200">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Marketplace</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/marketplace?category=grains" className="hover:text-primary-400 transition-colors">Grains & Paddy</Link>
              </li>
              <li>
                <Link to="/marketplace?category=vegetables" className="hover:text-primary-400 transition-colors">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="/marketplace?category=fruits" className="hover:text-primary-400 transition-colors">Orchard Fruits</Link>
              </li>
              <li>
                <Link to="/marketplace?category=spices" className="hover:text-primary-400 transition-colors">Spices & Condiments</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">About Our Mission</Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-primary-400 transition-colors">Success Stories</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition-colors">FAQs & Help</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Newsletter</h3>
            <p className="text-sm text-slate-400">
              Subscribe to receive crop price alerts, weather forecasts, and agriculture tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="bg-slate-800 dark:bg-dark-900 border border-slate-700 dark:border-dark-800 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-sm flex-1 w-full"
              />
              <button 
                type="submit"
                className="bg-primary-600 hover:bg-primary-500 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-primary-400 font-semibold animate-fade-in">
                Thank you! You have subscribed successfully.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lower Footer */}
      <div className="border-t border-slate-800 dark:border-dark-900 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} KrishiConnect AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={12} className="text-red-500 fill-current" /> for Indian Farmers & Rural Communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
