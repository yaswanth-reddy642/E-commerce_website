import React from 'react';
import { Quote, Star } from 'lucide-react';

export default function SuccessStories() {
  const stories = [
    {
      name: "Ramesh Kurapati",
      location: "Guntur, Andhra Pradesh",
      achievement: "Increased revenue by 35% selling Red Chili",
      quote: "Before KrishiConnect, I sold my Teja red chilies to local brokers for ₹130/kg. Listing it directly let me close wholesale deals at ₹185/kg. The direct escrow payment gives us immense security.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Anil Sandhu",
      location: "Ludhiana, Punjab",
      achievement: "Sold 12 Tons Basmati Paddy",
      quote: "The AI disease diagnostics helped me spot Rice Blast early. I sprayed the recommended fungicide immediately, saving my entire paddy acreage. I also sold my harvest to a wholesale buyer in Telangana without travel.",
      image: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Devendra Patil",
      location: "Nashik, Maharashtra",
      achievement: "Sourced 4.5 Tons Tomatoes for Retail chain",
      quote: "As a retailer, sourcing fresh vegetables from local markets was expensive due to dealer commissions. KrishiConnect let me negotiate contract rates with Ramesh directly and track shipment logs.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-left">
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="badge-orange">FARMER ACHIEVEMENTS</span>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2">Stories from Our Fields</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Read testimonies from farmers, wholesalers, and customers who have optimized their business cycles on our platform.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="flex flex-col gap-6 mt-4">
          {stories.map((st, i) => (
            <div 
              key={i} 
              className="glass-card p-6 border-slate-100 dark:border-dark-800 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden"
            >
              <Quote className="absolute top-6 right-6 text-primary-100 dark:text-dark-800/30 -z-10" size={64} />
              
              <img 
                src={st.image} 
                alt={st.name} 
                className="w-24 h-24 rounded-2xl object-cover border-2 border-primary-500/20"
              />

              <div className="flex-1 flex flex-col gap-2 relative z-10 text-left">
                <p className="text-sm text-slate-600 dark:text-slate-350 italic">
                  "{st.quote}"
                </p>
                
                <div className="border-t border-slate-150 dark:border-dark-800 pt-2.5 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{st.name}</h4>
                    <span className="text-[10px] text-slate-400">{st.location}</span>
                  </div>
                  <span className="badge-green">{st.achievement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
