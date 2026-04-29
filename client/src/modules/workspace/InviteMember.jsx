import React, { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const InviteMember = () => {
  const [email, setEmail] = useState('unknownuser@notfound.io');
  const [role, setRole] = useState('Team Member');
  const [status, setStatus] = useState('error'); // 'idle', 'error', 'success'

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="bg-surface rounded-xl shadow-md border border-border w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-border bg-gray-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Invite a Team Member</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the details below to send an invitation.</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address or Platform User ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
               <input 
                 type="text" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:outline-none ${status === 'error' ? 'border-red-500 text-red-600 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
               />
               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
               {status === 'error' && <AlertCircle size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />}
            </div>
            {status === 'error' ? (
              <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                <AlertCircle size={12}/> User not found on platform. Please check the email or ID.
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-2">Enter registered email or @username</p>
            )}
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign Role <span className="text-red-500">*</span>
            </label>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                onClick={() => setRole('Project Owner')}
              >
                <div>
                   <p className="text-sm font-semibold flex items-center gap-2">Project Owner</p>
                   <p className="text-xs text-gray-500">Full control - assign roles - remove members</p>
                </div>
                {role === 'Project Owner' && <CheckCircle2 size={18} className="text-primary"/>}
              </button>
              
              <div className="h-px bg-gray-200"></div>
              
              <button 
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                onClick={() => setRole('Project Manager')}
              >
                <div>
                   <p className="text-sm font-semibold flex items-center gap-2">Project Manager</p>
                   <p className="text-xs text-gray-500">Manage tasks & milestones</p>
                </div>
                {role === 'Project Manager' && <CheckCircle2 size={18} className="text-primary"/>}
              </button>
              
              <div className="h-px bg-gray-200"></div>
              
              <button 
                className="w-full flex items-center justify-between p-4 bg-primary text-white text-left transition-colors"
                onClick={() => setRole('Team Member')}
              >
                <div>
                   <p className="text-sm font-semibold flex items-center gap-2">Team Member</p>
                   <p className="text-xs text-gray-300">View & contribute to tasks</p>
                </div>
                {role === 'Team Member' && <CheckCircle2 size={18} className="text-white"/>}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Select the role to assign to the invited user.</p>
          </div>

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                 <CheckCircle2 size={20} className="text-green-500 mt-0.5" />
                 <div>
                   <p className="text-sm font-semibold text-green-800">Invitation Sent Successfully</p>
                   <p className="text-xs text-green-600 mt-1">Invitation sent to <span className="font-bold">sarah.new@company.com</span></p>
                 </div>
              </div>
              <button className="text-xs font-semibold text-green-700 hover:text-green-900 underline" onClick={() => setStatus('idle')}>Dismiss</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-gray-50 flex items-center justify-end gap-4">
           <button className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 bg-white">
             Cancel
           </button>
           <button 
             className="px-6 py-2 bg-primary text-white rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-opacity-90 shadow-sm"
             onClick={() => setStatus('success')}
           >
             <UserPlus size={16} /> Send Invitation
           </button>
        </div>

      </div>
    </div>
  );
};

export default InviteMember;
