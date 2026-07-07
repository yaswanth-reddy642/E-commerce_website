import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Scale, Star, ShoppingCart, MessageSquare, SlidersHorizontal, ArrowUpDown, X, MessageCircle } from 'lucide-react';

export default function Marketplace() {
  const { crops, addToCart, removeFromCart, user, proposeNegotiation, cart } = useApp();

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Detail Modal & Negotiation Modal states
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [negotiateCrop, setNegotiateCrop] = useState(null);
  
  // Form states
  const [buyQty, setBuyQty] = useState(1);
  const [negPrice, setNegPrice] = useState(0);
  const [negQty, setNegQty] = useState(0);
  const [negMsg, setNegMsg] = useState('');
  const [negSuccess, setNegSuccess] = useState(false);

  // Categories list
  const categories = [
    { value: 'all', label: 'All Crops' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'pulses', label: 'Pulses & Lentils' },
    { value: 'spices', label: 'Spices' }
  ];

  // States list (harvest locations)
  const states = ['all', 'Andhra Pradesh', 'Punjab', 'Karnataka', 'Telangana', 'Maharashtra'];

  // Handle open details
  const openDetails = (crop) => {
    setSelectedCrop(crop);
    setBuyQty(crop.min_bulk_order);
  };

  // Handle open negotiation
  const openNegotiation = (crop, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please sign in as a Retailer to propose custom bulk deals.");
      return;
    }
    if (user.role !== 'retailer') {
      alert("Only Retailer/Wholesaler accounts can initiate price negotiations.");
      return;
    }
    setNegotiateCrop(crop);
    setNegPrice(crop.price_per_kg - 2); // default proposed price slightly lower
    setNegQty(crop.min_bulk_order * 5); // default large bulk order
    setNegMsg("We'd like to place a bulk order. Requesting a custom volume discount.");
    setNegSuccess(false);
  };

  // Handle submit negotiation
  const handleNegotiateSubmit = async (e) => {
    e.preventDefault();
    try {
      await proposeNegotiation({
        crop_id: negotiateCrop.id,
        proposed_price: parseFloat(negPrice),
        proposed_quantity: parseFloat(negQty),
        message: negMsg
      });
      setNegSuccess(true);
      setTimeout(() => {
        setNegotiateCrop(null);
        setNegSuccess(false);
      }, 2000);
    } catch (err) {
      alert(err.message || "Negotiation offer failed.");
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (crop, qty, e) => {
    if (e) e.stopPropagation();
    addToCart(crop, qty);
    alert(`Added ${qty} kg of ${crop.title} to your cart!`);
    setSelectedCrop(null);
  };

  // Filter Logic
  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase()) ||
                          c.farmer_username.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesState = selectedState === 'all' || c.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  // Sort Logic
  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (sortBy === 'price-low') return a.price_per_kg - b.price_per_kg;
    if (sortBy === 'price-high') return b.price_per_kg - a.price_per_kg;
    if (sortBy === 'qty-high') return b.quantity_available - a.quantity_available;
    return 0; // default (recent or database order)
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-left">
      <div className="flex flex-col gap-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Smart Agri Marketplace</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse fresh, certified farm yields directly listed by local farmers. Save on commission, buy fresh.
          </p>
        </div>

        {/* Search & Filtering Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crops, farmers, or keywords..."
              className="glass-input pl-10 w-full"
            />
          </div>

          {/* Location State filter */}
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="glass-input py-2 text-sm flex-1 w-full bg-white dark:bg-dark-900"
            >
              <option value="all">All States</option>
              {states.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input py-2 text-sm flex-1 w-full bg-white dark:bg-dark-900"
            >
              <option value="default">Default Sort</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="qty-high">Yield Availability</option>
            </select>
          </div>
        </div>

        {/* Categories Tab Row */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                selectedCategory === cat.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-slate-600 dark:text-slate-300 hover:border-primary-500/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Crops Grid */}
        {sortedCrops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
            {sortedCrops.map(crop => {
              // Calculate average rating
              const ratingSum = crop.reviews?.reduce((sum, r) => sum + r.rating, 0) || 0;
              const avgRating = crop.reviews?.length > 0 ? (ratingSum / crop.reviews.length).toFixed(1) : "N/A";
              
              return (
                <div
                  key={crop.id}
                  onClick={() => openDetails(crop)}
                  className="glass-card glass-card-hover overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  {/* Crop Image */}
                  <div className="h-44 relative bg-slate-100 dark:bg-dark-950">
                    <img
                      src={crop.image_url}
                      alt={crop.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 badge-green capitalize">{crop.category}</span>
                  </div>

                  {/* Crop Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      {/* Farmer and Location */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="capitalize">Farmer: {crop.farmer_username}</span>
                        <span className="flex items-center gap-0.5"><MapPin size={10} /> {crop.state}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white mt-1 text-sm line-clamp-1">{crop.title}</h3>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <span className="text-xs text-slate-400">Price per kg</span>
                        <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">₹{crop.price_per_kg}</p>
                      </div>
                      
                      {/* Blinkit style button */}
                      {(!user || user.role === 'customer' || user.role === 'retailer') ? (
                        <div className="relative">
                          {(() => {
                            const cartItem = cart.find(item => item.crop_id === crop.id);
                            if (!cartItem) {
                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(crop, crop.min_bulk_order);
                                  }}
                                  className="bg-white hover:bg-slate-50 dark:bg-dark-900 border border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400 text-xs font-bold px-4 py-1.5 rounded-xl hover:shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95"
                                >
                                  ADD <span className="text-primary-500 font-extrabold">+</span>
                                </button>
                              );
                            }
                            return (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center bg-primary-600 dark:bg-primary-500 text-white rounded-xl shadow-sm overflow-hidden"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextQty = cartItem.quantity - 10;
                                    if (nextQty < crop.min_bulk_order) {
                                      removeFromCart(crop.id);
                                    } else {
                                      addToCart(crop, -10);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 hover:bg-primary-750 dark:hover:bg-primary-650 font-bold transition-all text-xs"
                                >
                                  -
                                </button>
                                <span className="px-1 text-xs font-black min-w-[50px] text-center select-none">
                                  {cartItem.quantity} kg
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (cartItem.quantity + 10 > crop.quantity_available) {
                                      alert("Cannot exceed available crop yield stock.");
                                      return;
                                    }
                                    addToCart(crop, 10);
                                  }}
                                  className="px-2.5 py-1.5 hover:bg-primary-750 dark:hover:bg-primary-650 font-bold transition-all text-xs"
                                >
                                  +
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs text-slate-400">Min Order</span>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-350">{crop.min_bulk_order} kg</p>
                        </div>
                      )}
                    </div>

                    {/* Stock Alert bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                        <span>STOCK STATUS</span>
                        <span>{crop.quantity_available} kg Left</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-dark-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary-500 h-full rounded-full" 
                          style={{ width: `${Math.min((crop.quantity_available / 10000) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-dark-800/50 pt-2">
                      <span className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /> {avgRating}</span>
                      {/* Proposal negotiation button */}
                      {(!user || user.role === 'retailer') && (
                        <button
                          onClick={(e) => openNegotiation(crop, e)}
                          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-bold hover:underline"
                        >
                          <MessageSquare size={13} /> Negotiate Price
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/50 dark:border-dark-800/60 p-8 mt-4">
            <Search size={48} className="text-slate-300 dark:text-dark-800 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Crops Found</h3>
            <p className="text-slate-400 text-sm mt-1">Try relaxing your search terms or selecting another state.</p>
          </div>
        )}

      </div>

      {/* 1. Crop Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in scale-in duration-250 text-left flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="relative h-60 bg-slate-100 dark:bg-dark-950">
              <img src={selectedCrop.image_url} alt={selectedCrop.title} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedCrop(null)}
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/75 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="badge-green capitalize mb-2 inline-block">{selectedCrop.category}</span>
                <h2 className="text-2xl font-black text-white drop-shadow-md">{selectedCrop.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Crop Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed mt-1">{selectedCrop.description || "No description provided."}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-dark-950/40 p-4 rounded-xl border border-slate-100 dark:border-dark-800/40 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Rate</span>
                  <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">₹{selectedCrop.price_per_kg}/kg</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Location</span>
                  <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">{selectedCrop.location}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Min Order</span>
                  <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">{selectedCrop.min_bulk_order} kg</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Stock</span>
                  <p className="text-base font-extrabold text-slate-850 dark:text-slate-200">{selectedCrop.quantity_available} kg</p>
                </div>
              </div>

              {/* Purchase Drawer Form */}
              {(!user || user.role === 'customer' || user.role === 'retailer') && (
                <div className="border border-primary-200/40 dark:border-primary-800/40 bg-primary-50/20 dark:bg-primary-950/10 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-slate-400">Order Quantity</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="number"
                        min={selectedCrop.min_bulk_order}
                        max={selectedCrop.quantity_available}
                        value={buyQty}
                        onChange={(e) => setBuyQty(Math.max(selectedCrop.min_bulk_order, parseFloat(e.target.value) || 0))}
                        className="glass-input py-1.5 w-24 text-center"
                      />
                      <span className="text-sm font-semibold">kg</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col">
                    <span className="text-xs text-slate-400">Total Price</span>
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100">₹{(buyQty * selectedCrop.price_per_kg).toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(selectedCrop, buyQty)}
                    className="btn-primary py-2.5 px-5 w-full sm:w-auto"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              )}

              {/* Reviews Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Customer Reviews ({selectedCrop.reviews?.length || 0})</h4>
                {selectedCrop.reviews?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {selectedCrop.reviews.map(r => (
                      <div key={r.id} className="bg-slate-50 dark:bg-dark-950/20 p-3 rounded-xl border border-slate-100 dark:border-dark-800/40 text-left">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold capitalize">{r.buyer_name}</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold"><Star size={10} className="fill-current" /> {r.rating}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No reviews submitted for this yield batch yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Proposal Price Negotiation Modal */}
      {negotiateCrop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-left animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Propose Bulk Contract</h3>
                <p className="text-xs text-slate-400">Listing: {negotiateCrop.title}</p>
              </div>
              <button 
                onClick={() => setNegotiateCrop(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            {negSuccess ? (
              <div className="text-center py-8">
                <span className="text-4xl">🚀</span>
                <h4 className="text-base font-bold text-primary-600 dark:text-primary-400 mt-2">Offer Sent Successfully!</h4>
                <p className="text-xs text-slate-450 mt-1">Farmer Ramesh will review and reply on your Wholesale Panel.</p>
              </div>
            ) : (
              <form onSubmit={handleNegotiateSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-dark-950/40 p-3 rounded-xl border border-slate-100 dark:border-dark-800/40">
                  <div>
                    <span className="text-slate-400 font-bold uppercase">FARMER RATE</span>
                    <p className="text-sm font-bold mt-0.5">₹{negotiateCrop.price_per_kg}/kg</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase">MIN BULK REQ</span>
                    <p className="text-sm font-bold mt-0.5">{negotiateCrop.min_bulk_order} kg</p>
                  </div>
                </div>

                {/* Proposed price input */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Your Proprosed Price (₹/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    value={negPrice}
                    onChange={(e) => setNegPrice(parseFloat(e.target.value) || 0)}
                    className="glass-input w-full text-sm"
                  />
                </div>

                {/* Proposed quantity input */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Volume Quantity (kg)</label>
                  <input
                    type="number"
                    min={negotiateCrop.min_bulk_order}
                    max={negotiateCrop.quantity_available}
                    required
                    value={negQty}
                    onChange={(e) => setNegQty(parseFloat(e.target.value) || 0)}
                    className="glass-input w-full text-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Must be at least the crop's min order size of {negotiateCrop.min_bulk_order} kg.</p>
                </div>

                {/* Custom negotiation message */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Negotiation Note / Message</label>
                  <textarea
                    rows="2"
                    required
                    value={negMsg}
                    onChange={(e) => setNegMsg(e.target.value)}
                    className="glass-input w-full text-sm resize-none"
                    placeholder="Enter details..."
                  />
                </div>

                <div className="flex gap-3 justify-end mt-2">
                  <button 
                    type="button" 
                    onClick={() => setNegotiateCrop(null)}
                    className="btn-secondary py-2 px-4 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary py-2 px-5 text-xs font-semibold rounded-xl"
                  >
                    Send Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Blinkit style sticky bottom bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-6 z-40 max-w-md border border-slate-800 animate-in slide-in-from-bottom duration-250">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2.5 rounded-xl text-white">
              <ShoppingCart size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-black">{cart.reduce((sum, item) => sum + item.quantity, 0)} kg in Cart</p>
              <p className="text-xs text-slate-400">Total: ₹{cart.reduce((sum, item) => sum + item.quantity * item.price_per_kg, 0).toFixed(2)}</p>
            </div>
          </div>
          
          <Link to="/cart" className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-1">
            View Cart →
          </Link>
        </div>
      )}

    </div>
  );
}
