import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, CheckCircle, UploadCloud, AlertCircle } from 'lucide-react';

export default function KycVerification() {
  const { user, submitKyc } = useApp();
  const navigate = useNavigate();

  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [landRecords, setLandRecords] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (aadhaar.length !== 12 || isNaN(aadhaar)) {
      setError("Aadhaar Card must be exactly 12 numeric digits.");
      return;
    }
    if (pan.length !== 10) {
      setError("PAN Card must be exactly 10 alphanumeric characters.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await submitKyc({
        aadhaar_number: aadhaar,
        pan_number: pan.toUpperCase(),
        land_records_link: landRecords || "http://landrecords.gov.in/mock/" + user.username
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/${user.role}`);
      }, 2500);
    } catch (err) {
      setError(err.message || "Failed to submit KYC documentation.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card border-slate-100 text-center">
        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
        <h3 className="text-lg font-bold text-slate-800">Access Restricted</h3>
        <p className="text-sm text-slate-500 mt-2">Please login to submit your KYC records.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[85vh] flex items-center justify-center text-left">
      <div className="w-full max-w-md glass-card p-8 border-slate-100 dark:border-dark-800 shadow-xl">
        <div className="text-center mb-6">
          <ShieldCheck className="text-primary-600 mx-auto" size={48} />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-2">KYC Profile Verification</h2>
          <p className="text-xs text-slate-400 mt-1">Submit documents to verify your farmer/wholesaler seller credentials</p>
        </div>

        {success ? (
          <div className="text-center py-6 flex flex-col items-center gap-3">
            <CheckCircle className="text-primary-600 animate-bounce" size={40} />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Documents Uploaded!</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Your KYC status is now <strong>Pending Admin Review</strong>. You will be redirected to your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200/40 dark:border-amber-900/40 p-4 rounded-xl text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-1">
              <strong>Why verify?</strong> To prevent fraudulent listings, our platform requires active document approvals before farmers can publish crops, and wholesalers can negotiate purchases.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Aadhaar Card Number (12 Digits)</label>
              <input
                type="text"
                required
                maxLength="12"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="1234 5678 9012"
                className="glass-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">PAN Card Number (10 Characters)</label>
              <input
                type="text"
                required
                maxLength="10"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="ABCDE1234F"
                className="glass-input w-full text-sm uppercase"
              />
            </div>

            {user.role === 'farmer' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Land Registry Certificate URL</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="url"
                    value={landRecords}
                    onChange={(e) => setLandRecords(e.target.value)}
                    placeholder="http://landrecords.ap.gov.in/yourname"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
                <p className="text-[10px] text-slate-450 mt-1">Optional. Link to state web land record or upload copy link.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 rounded-xl w-full font-bold mt-2 text-sm"
            >
              {loading ? "Submitting documentation..." : "Submit for Verification"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
