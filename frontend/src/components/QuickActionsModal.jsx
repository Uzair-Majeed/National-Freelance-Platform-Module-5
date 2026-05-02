import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckSquare, UserPlus, ClipboardList, MessageSquare, Settings } from 'lucide-react';

const QuickActionsModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const actions = [
    { label: 'Create New Task', icon: <CheckSquare size={20} />, description: 'Add milestones securely.', path: '/tasks/new' },
    { label: 'Invite Member', icon: <UserPlus size={20} />, description: 'Connect external builders.', path: '/team' },
    { label: 'Access settings', icon: <Settings size={20} />, description: 'Manage environment controls.', path: '/settings' },
    { label: 'View Activity Log', icon: <ClipboardList size={20} />, description: 'Audit collaborative metrics.', path: '/activity' },
    { label: 'Team Discussion', icon: <MessageSquare size={20} />, description: 'Engage real-time relays.', path: '/chat' }
  ];

  const handleSelection = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-lg w-full p-6 animate-slide-up">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-primary">Quick Workspace Actions</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Select an operation to proceed seamlessly.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors bg-gray-50 border p-1.5 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSelection(action.path)}
              className="flex items-start gap-3.5 p-4 bg-white border border-border rounded-xl shadow-sm hover:border-primary hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 bg-gray-50 group-hover:bg-primary/5 border rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors shadow-inner shrink-0">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-primary tracking-tight">{action.label}</p>
                <p className="text-[10px] font-semibold text-gray-400 mt-0.5 leading-relaxed">{action.description}</p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default QuickActionsModal;
