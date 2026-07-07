import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How does the direct farmer-to-buyer model work?",
      a: "Farmers list their fresh harvests (paddy, grain, vegetables) with quantities and base prices. Buyers can browse, select, and purchase directly. Retailers/Wholesalers can negotiate custom discounts on bulk volumes."
    },
    {
      q: "How does the payment escrow system secure transactions?",
      a: "When a buyer checks out, payments are securely escrowed. Funds are locked in our system and only released to the farmer's bank account after the shipping logistics transport completes and the buyer confirms cargo verification."
    },
    {
      q: "What credentials are required for KYC profile approvals?",
      a: "To verify crop lists, farmers must upload Aadhaar cards, PAN details, and land registry certificate links. Wholesalers must upload Aadhaar and PAN credentials to request contract negotiations. Admins approve/reject KYC records."
    },
    {
      q: "How does the AI Crop leaf disease scan work?",
      a: "Farmers take a photo of an infected leaf and upload it. The model diagnoses pattern signatures, scoring confidence rates (e.g. 92% Late Blight) and returns treatment advisories and preventative measures."
    },
    {
      q: "Are the crop recommendations tailored to my state?",
      a: "Yes. Soil chemical readings (Nitrogen, Phosphorous, Potassium) alongside region temperatures and pH indexes are cross-referenced to historical state cropping registries to match suitable grains/vegetables."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-left">
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="badge-green">HELP DESK</span>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">Frequently Asked Questions</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Everything you need to know about our smart agricultural platform, secure payments, and AI advisory tools.
          </p>
        </div>

        {/* Faqs List Accordion */}
        <div className="flex flex-col gap-3 mt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="glass-card border-slate-150 dark:border-dark-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center font-bold text-slate-800 dark:text-slate-200 text-sm hover:bg-slate-50/50 dark:hover:bg-dark-800/10 text-left transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-dark-800/40 text-xs text-slate-500 dark:text-slate-400 leading-relaxed animate-in slide-in-from-top-2 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
