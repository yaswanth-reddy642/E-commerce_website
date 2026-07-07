import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Trash2, ShieldCheck, MapPin, Truck, CreditCard, X, ShieldAlert } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, placeOrder, user } = useApp();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  // Checkout flow states
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.price_per_kg, 0);
  const gst = subtotal * 0.05; // 5% CGST+SGST
  const transport = subtotal > 5000 ? 0 : 350; // free delivery over 5000
  const grandTotal = subtotal > 0 ? subtotal + gst + transport : 0;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (!user) {
      alert("Please login first to complete your checkout.");
      navigate('/login');
      return;
    }

    // Launch mock Razorpay modal
    setPaying(true);
    setError(null);
  };

  const handlePaymentConfirm = async () => {
    try {
      const mockPayId = "pay_rzp_" + Math.random().toString(36).substr(2, 9);
      await placeOrder(address, grandTotal, mockPayId);
      setPaySuccess(true);
      setTimeout(() => {
        setPaying(false);
        setPaySuccess(false);
        navigate(`/dashboard/${user.role}`);
      }, 2500);
    } catch (err) {
      setError(err.message || "Checkout transaction failed.");
      setPaying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-left relative">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="text-primary-600 dark:text-primary-400" size={24} />
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Shopping Cart</h1>
          </div>

          {cart.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cart.map(item => (
                <div key={item.crop_id} className="glass-card p-4 border-slate-100 dark:border-dark-800 flex items-center justify-between gap-4">
                  <img src={item.image_url} alt={item.crop_title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{item.crop_title}</h3>
                    <p className="text-xs text-slate-400 mt-1">₹{item.price_per_kg}/kg • Ordered {item.quantity} kg</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">₹{(item.quantity * item.price_per_kg).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.crop_id)}
                      className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800 rounded-3xl p-8">
              <ShoppingBag size={48} className="text-slate-350 dark:text-dark-800 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-350">Your Cart is Empty</h3>
              <p className="text-slate-400 text-sm mt-1 mb-6">Explore the marketplace to procure fresh crops.</p>
              <Link to="/marketplace" className="btn-primary inline-flex">Go to Marketplace</Link>
            </div>
          )}
        </div>

        {/* Address and Pricing Summary Card */}
        {cart.length > 0 && (
          <div className="w-full lg:w-96 flex flex-col gap-4">
            {/* Delivery address form */}
            <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-md">
              <h3 className="font-bold text-slate-800 dark:text-white text-base mb-4 flex items-center gap-1.5"><MapPin size={18} className="text-primary-600" /> Delivery Details</h3>
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Shipping Address</label>
                  <textarea
                    rows="3"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address, town/city, pincode"
                    className="glass-input w-full text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter recipient number"
                    className="glass-input w-full text-xs"
                  />
                </div>

                <hr className="border-slate-100 dark:border-dark-850 my-2" />

                {/* Price breakdown */}
                <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-450">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistics transport</span>
                    <span className="font-bold text-slate-800 dark:text-slate-300">{transport === 0 ? "FREE" : `₹${transport}`}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-100 dark:border-dark-800 pt-2 text-slate-800 dark:text-slate-100 font-extrabold">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary py-3 rounded-xl w-full font-bold mt-2 text-sm"
                >
                  Proceed to Payment <CreditCard size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Razorpay Checkout Gateway Modal overlay */}
      {paying && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-left animate-in zoom-in-95 duration-200">
            {/* RZP Logo banner */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">💳</span>
                <span className="font-bold tracking-tight text-slate-100">Razorpay Secure</span>
              </div>
              <button 
                onClick={() => setPaying(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {paySuccess ? (
              <div className="text-center py-8 flex flex-col items-center gap-3">
                <CheckCircleAnimation />
                <h4 className="text-base font-bold text-primary-400 mt-2">Payment Authenticated!</h4>
                <p className="text-[11px] text-slate-400">Order successfully escrowed. Redirecting to your dashboard...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-slate-950 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Escrow Merchant</span>
                  <span className="text-xs font-bold text-slate-100 block mt-0.5">KrishiConnect AI Platform</span>
                  <span className="text-2xl font-black text-primary-400 block mt-2">₹{grandTotal.toFixed(2)}</span>
                </div>

                <div className="flex flex-col gap-1 bg-slate-850 p-3 rounded-lg text-xs text-slate-350 border border-slate-800">
                  <p><strong>Recipient Address:</strong></p>
                  <p className="truncate">{address}</p>
                </div>

                <div className="flex gap-2 items-center bg-primary-950/20 border border-primary-900/40 p-3 rounded-lg text-[10px] text-primary-400 leading-normal">
                  <ShieldCheck size={20} className="flex-shrink-0" />
                  Your payment is locked in a secure agricultural escrow and only released to the farmer Ramesh once the delivery transport completes.
                </div>

                <button
                  onClick={handlePaymentConfirm}
                  className="bg-primary-500 hover:bg-primary-600 font-extrabold text-white py-3 rounded-xl w-full text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Pay Now (Sandbox Environment)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for checkmark animation
function CheckCircleAnimation() {
  return (
    <div className="h-16 w-16 bg-primary-950 border border-primary-800 rounded-full flex items-center justify-center text-primary-400 text-2xl animate-bounce">
      ✓
    </div>
  );
}
