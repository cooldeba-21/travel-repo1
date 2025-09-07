import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateUserConsent } from '../../services/firestore';
import { Shield, CheckCircle, AlertTriangle, MapPin, LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable InfoCard component
type InfoCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  color: 'primary' | 'success' | 'warning';
};

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, text, color }) => (
  <div className={`flex items-start gap-3 p-4 bg-${color}-50 rounded-xl border border-${color}-100`}>
    <Icon className={`w-5 h-5 text-${color}-600 mt-0.5 flex-shrink-0`} />
    <div>
      <h3 className={`font-semibold text-${color}-900`}>{title}</h3>
      <p className={`text-${color}-700 text-sm leading-relaxed`}>{text}</p>
    </div>
  </div>
);

const ConsentForm: React.FC = () => {
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, updateConsent } = useAuth();

  const handleConsent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || !user || !agreed) return;

    setLoading(true);
    try {
      await updateUserConsent(user.uid);
      updateConsent();
      toast.success('Thank you for your consent!');
    } catch (error) {
      console.error('Consent update failed:', error);
      toast.error('Failed to update consent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <form
        onSubmit={handleConsent}
        className="max-w-2xl w-full card overflow-hidden shadow-strong animate-slide-up"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-700/90"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-xl mr-3 backdrop-blur-sm">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Data Consent</h1>
            </div>
            <p className="text-primary-100 font-medium">NATPAC Travel Data Collection</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4 tracking-tight">
              Privacy & Data Usage
            </h2>
            <p className="text-neutral-600 mb-4 leading-relaxed">
              Welcome to the AeroVoyage Trav Agent.
              Your privacy is important to us. Please review and provide your consent
            </p>
          </div>

          {/* Data Collection Info */}
          <div className="space-y-4 mb-6">
            <InfoCard
              icon={MapPin}
              title="Location Data"
              text="We collect your trip origins and destinations to understand travel patterns and improve transportation planning."
              color="primary"
            />
            <InfoCard
              icon={CheckCircle}
              title="Data Protection"
              text="All data is encrypted and stored securely. Your personal information will never be shared with third parties."
              color="success"
            />
            <InfoCard
              icon={AlertTriangle}
              title="Data Usage"
              text="Your trip data will be used for transportation research and urban planning purposes in an anonymized format."
              color="warning"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="mb-6">
            <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer">
              <input
                id="consent"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary-600 border-neutral-300 rounded-md focus:ring-primary-500 focus:ring-2 transition-all duration-200"
              />
              <span className="text-neutral-700 text-sm leading-relaxed font-medium">
                I understand and agree to the collection and use of my travel data as described above. 
                I can withdraw my consent at any time by contacting the research team.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={!agreed || loading}
              className="btn-primary w-full py-4 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Accept & Continue'
              )}
            </button>

            <p className="text-center text-xs text-neutral-500 leading-relaxed">
              By proceeding, you acknowledge that you have read and understood our data collection
              practices.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsentForm;
