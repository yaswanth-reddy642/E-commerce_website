import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Truck, MapPin, CheckCircle, Clock, ShieldAlert, Heart } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, orders, api, fetchCrops } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  
  // Review submission states
  const [selectedOrderCrop, setSelectedOrderCrop] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'customer') navigate(`/dashboard/${user.role}`);
  }, [user]);

  if (!user || user.role !== 'customer') return null;

  // Filter orders where buyer is this user
  const buyerOrders = orders.filter(o => o.buyer_id === user.id);

  const openReviewModal = (cropId, cropTitle) => {
    setSelectedOrderCrop({ id: cropId, title: cropTitle });
    setRating(5);
    setComment('');
    setReviewSuccess(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/crops/${selectedOrderCrop.id}/reviews`, {
        crop_id: selectedOrderCrop.id,
        rating: parseInt(rating),
        comment: comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviewSuccess(true);
      fetchCrops();
      setTimeout(() => {
        setSelectedOrderCrop(null);
      }, 2000);
    } catch (err) {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-left flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-2 flex-shrink-0">
        <div className="glass-card p-4 border-slate-100 dark:border-dark-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center font-bold text-primary-755">
            👤
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white capitalize">{user.username}</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">Customer</span>
          </div>
        </div>

        <div className="glass-card border-slate-100 dark:border-dark-800 overflow-hidden py-2 flex flex-col">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left transition-all ${
              activeTab === 'orders'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 border-l-4 border-primary-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800/20'
            }`}
          >
            <ShoppingBag size={16} />
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left transition-all ${
              activeTab === 'wishlist'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 border-l-4 border-primary-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800/20'
            }`}
          >
            <Heart size={16} />
            My Wishlist
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 w-full">
        {activeTab === 'orders' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4">Purchase History</h3>
            
            {buyerOrders.length > 0 ? (
              <div className="flex flex-col gap-4">
                {buyerOrders.map(order => (
                  <div key={order.id} className="p-4 bg-slate-50 dark:bg-dark-950/20 border border-slate-200/40 dark:border-dark-800 rounded-xl flex flex-col gap-4 text-xs">
                    {/* Upper order summary */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-150 dark:border-dark-800 pb-2 gap-2">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-350">Order ID: #{order.id}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Placed: {new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 ${
                          order.shipping_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.shipping_status === 'delivered' ? <CheckCircle size={10} /> : <Clock size={10} />}
                          {order.shipping_status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-col gap-2.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.crop_title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{item.quantity} kg @ ₹{item.price_per_kg}/kg</p>
                          </div>
                          
                          {/* Write Review option */}
                          {order.shipping_status === 'delivered' && (
                            <button
                              onClick={() => openReviewModal(item.crop_id, item.crop_title)}
                              className="text-primary-600 dark:text-primary-400 hover:underline font-bold text-[10px] flex items-center gap-0.5"
                            >
                              <Star size={12} className="fill-current" /> Write a Review
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address and Summary */}
                    <div className="border-t border-slate-150 dark:border-dark-800 pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-slate-450">
                      <p className="flex items-center gap-1"><MapPin size={12} /> {order.delivery_address}</p>
                      <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Total paid: ₹{order.total_price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-450">
                <ShoppingBag className="mx-auto mb-2 text-slate-350" size={32} />
                <p className="italic text-xs">You haven't placed any purchases yet. Head over to the marketplace to start buying.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="glass-card p-6 border-slate-100 dark:border-dark-800 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4">My Wishlist</h3>
            <p className="text-xs text-slate-400 italic">Your saved crop listings will appear here for easy checkouts.</p>
          </div>
        )}

      </div>

      {/* Review Modal dialog */}
      {selectedOrderCrop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-left animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Submit Crop Review</h3>
            <p className="text-xs text-slate-400 mt-1">Share feedback for: {selectedOrderCrop.title}</p>

            {reviewSuccess ? (
              <div className="text-center py-6">
                <span className="text-3xl">⭐️</span>
                <h4 className="font-bold text-primary-600 mt-2 text-sm">Review Submitted!</h4>
                <p className="text-xs text-slate-400">Thank you for rating the crop quality.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1.5">Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="glass-input w-full text-xs bg-white dark:bg-dark-900"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ Good (4 Stars)</option>
                    <option value="3">⭐⭐⭐ Moderate (3 Stars)</option>
                    <option value="2">⭐⭐ Fair (2 Stars)</option>
                    <option value="1">⭐ Poor (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1.5">Comment / Experience</label>
                  <textarea
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="glass-input w-full text-xs resize-none"
                    placeholder="Describe crop freshness, size, cleanliness..."
                  />
                </div>

                <div className="flex gap-2 justify-end mt-2">
                  <button 
                    type="button" 
                    onClick={() => setSelectedOrderCrop(null)}
                    className="btn-secondary py-2 px-4 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary py-2 px-5 text-xs font-semibold rounded-xl"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
