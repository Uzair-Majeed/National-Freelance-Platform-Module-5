import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const AccessDeniedModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 flex flex-col items-center text-center gap-6 animate-slide-up">
        
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
          <AlertCircle size={32} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-primary leading-snug">Access Denied</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            You do not have permissions to view this workspace. Please verify credentials or request explicit authorization.
          </p>
        </div>

        <button 
          onClick={() => navigate('/invite')} 
          className="w-full py-2.5 bg-primary text-white hover:bg-opacity-90 rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 transition-all pt-2"
        >
          <ArrowLeft size={14}/> Back to Gateway
        </button>

      </div>
    </div>
  );
};

export default AccessDeniedModal;
