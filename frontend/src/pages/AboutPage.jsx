import React from 'react';
import { ShieldCheck, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-left">
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="badge-green">OUR MISSION</span>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2">Empowering Farmers, Enriching Lives</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            KrishiConnect AI is a next-generation platform designed to establish a transparent, direct agricultural ecosystem across India.
          </p>
        </div>

        {/* Banner Image */}
        <div className="h-64 rounded-3xl overflow-hidden bg-slate-100 dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800/60 shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d159062255?auto=format&fit=crop&w=1200&q=80" 
            alt="Agriculture Field" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2.5">The Direct selling Model</h3>
            <p className="mb-4">
              Traditional supply chains route produce through multiple middlemen (commission brokers), resulting in farmers receiving less than 30% of what the consumer pays. KrishiConnect AI bypasses this.
            </p>
            <p>
              By offering direct marketplace listings and secure Razorpay escrow releases, we ensure farmers receive fair market values, while customers receive fresh yields.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2.5">Smart AI Advisory Integration</h3>
            <p className="mb-4">
              AI crop recommenders analyze soil chemical values (Nitrogen, Phosphorous, Potassium, pH) alongside meteorological profiles to recommend optimal crop categories.
            </p>
            <p>
              Our Leaf Health diagnostic engine uses computer vision to detect crop disease patterns on leaf scans, generating instant treatment instructions.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 dark:bg-dark-900/40 p-6 rounded-2xl border border-slate-200/40 dark:border-dark-800 text-center mt-4">
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck className="text-primary-600" size={24} />
            <h4 className="font-bold text-slate-850 dark:text-white text-xs uppercase">Escrow Secure</h4>
            <p className="text-[10px] text-slate-400">Payments released only post delivery validation</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-dark-800 py-4 sm:py-0">
            <Award className="text-primary-600" size={24} />
            <h4 className="font-bold text-slate-850 dark:text-white text-xs uppercase">Verified KYC</h4>
            <p className="text-[10px] text-slate-400">Strict Aadhaar & land check certifications</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Heart className="text-primary-600" size={24} />
            <h4 className="font-bold text-slate-850 dark:text-white text-xs uppercase">Direct Impact</h4>
            <p className="text-[10px] text-slate-400">Supporting rural livelihoods directly</p>
          </div>
        </div>

      </div>
    </div>
  );
}
