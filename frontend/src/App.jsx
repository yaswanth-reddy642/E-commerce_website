import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages Import
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import AboutPage from './pages/AboutPage';
import SuccessStories from './pages/SuccessStories';
import FaqPage from './pages/FaqPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KycVerification from './pages/KycVerification';
import CartPage from './pages/CartPage';

// Dashboards Import
import FarmerDashboard from './pages/FarmerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen transition-colors duration-250 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-dark-50">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/stories" element={<SuccessStories />} />
              <Route path="/faq" element={<FaqPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/kyc-verification" element={<KycVerification />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Role-Based Dashboard Routes */}
              <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
              <Route path="/dashboard/customer" element={<CustomerDashboard />} />
              <Route path="/dashboard/retailer" element={<RetailerDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
