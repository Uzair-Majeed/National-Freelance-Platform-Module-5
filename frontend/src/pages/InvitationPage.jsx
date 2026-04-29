import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Check, X } from 'lucide-react';

const InvitationModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 flex flex-col items-center text-center gap-6 animate-slide-up">
        
        <div className="w-16 h-16 bg-primary/5 border rounded-2xl flex items-center justify-center text-primary shadow-inner">
          <Mail size={32} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-primary leading-snug">Workspace Invitation</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            You have been invited to join <span className="font-bold text-primary">Apollo Brand Redesign</span> by <span className="font-bold text-primary">Alex Rivera</span>.
          </p>
        </div>

        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2 text-xs text-left font-medium text-gray-600">
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Access to all collaborative kanban boards.</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Real-time team communication feeds.</p>
        </div>

        <div className="flex items-center gap-3 w-full pt-2">
          <button 
            onClick={() => navigate('/denied')} 
            className="flex-1 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-primary rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <X size={14}/> Decline
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 py-2.5 bg-primary text-white hover:bg-opacity-90 rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Check size={14}/> Accept & Join
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvitationModal;
