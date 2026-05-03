import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldAlert, Save } from 'lucide-react';
import { workspaceApi } from '../api';

const InviteModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [workspaceId, setWorkspaceId] = useState('');

  useEffect(() => {
    const fetchWorkspace = async () => {
      const wsData = await workspaceApi.getByProject(1);
      if (wsData.success && wsData.data.length > 0) {
        setWorkspaceId(wsData.data[0].id);
      }
    };
    if (isOpen) fetchWorkspace();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workspaceId) {
      alert('Workspace not found');
      return;
    }

    try {
      setLoading(true);
      await workspaceApi.inviteUser(workspaceId, email);
      alert('Invitation sent successfully!');
      onClose();
      setEmail('');
      setRole('MEMBER');
      setMessage('');
    } catch (err) {
      console.error('Error inviting user:', err);
      alert('Failed to send invitation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface rounded-xl shadow-2xl border border-border max-w-md w-full p-6 animate-slide-up">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Mail size={20}/> Invite New Member
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="border border-gray-300 rounded-lg p-2.5 text-sm font-bold focus:outline-none focus:border-primary shadow-inner w-full text-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              Select Role
            </label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-primary focus:outline-none focus:border-primary cursor-pointer bg-white shadow-sm"
            >
              <option value="MEMBER">Member (Default)</option>
              <option value="PROJECT MANAGER">Project Manager</option>
              <option value="PROJECT OWNER">Project Owner</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Personal Message (Optional)</label>
            <textarea 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey! Join our workspace to collaborate."
              className="border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-primary shadow-inner w-full text-primary leading-relaxed"
            />
          </div>

          <div className="flex justify-end items-center gap-3 pt-4 border-t border-border mt-6">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 bg-white border border-gray-300 text-primary rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={14}/> {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default InviteModal;
