import React from 'react';
import { Mailbox, CheckCircle2, XCircle } from 'lucide-react';

const InvitationResponse = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[calc(100vh-8rem)]">
      <div className="bg-surface rounded-xl shadow-lg border border-border w-full max-w-md overflow-hidden text-center relative">
        
        {/* Banner */}
        <div className="h-2 bg-primary w-full absolute top-0 left-0"></div>

        <div className="p-8 pb-6 flex flex-col items-center pt-10">
          <div className="w-16 h-16 rounded-full bg-gray-50 border-4 border-white shadow-sm flex items-center justify-center text-gray-500 mb-4 z-10 -mt-14">
             <Mailbox size={32} className="text-primary"/>
          </div>
          
          <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Workspace Invitation</p>
          <h2 className="text-2xl font-bold text-primary mb-6">You've been invited to a workspace</h2>

          <div className="bg-gray-50 w-full rounded-xl p-6 border border-gray-200 mb-6 flex flex-col items-center">
             <p className="text-xs uppercase font-bold text-gray-500 mb-1">Project</p>
             <h3 className="text-xl font-bold text-primary">Apollo Brand Redesign</h3>
             <p className="text-xs text-gray-500 mt-1">Acme Workspace</p>
          </div>

          <div className="w-full text-left space-y-6">
             <div>
                <p className="text-xs uppercase font-bold text-gray-500 mb-2">Invited By</p>
                <div className="flex items-center justify-between border border-gray-200 p-3 rounded-lg bg-white">
                   <div className="flex items-center gap-3">
                      <img src="https://ui-avatars.com/api/?name=Sarah+Mitchell&background=random" alt="Sarah Mitchell" className="w-10 h-10 rounded-full" />
                      <div>
                         <p className="text-sm font-semibold text-primary">Sarah Mitchell</p>
                         <p className="text-[10px] text-gray-500">Project Owner &middot; sarah.mitchell@studio.io</p>
                      </div>
                   </div>
                   <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 rounded text-gray-600">Owner</span>
                </div>
             </div>

             <div>
                <p className="text-xs uppercase font-bold text-gray-500 mb-2">Your Assigned Role</p>
                <div className="flex items-center gap-4 bg-primary text-white p-3 rounded-lg">
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-semibold flex items-center gap-2"><CheckCircle2 size={16}/> Team Member</span>
                   </div>
                   <p className="text-xs text-gray-300">View & contribute to tasks in this workspace.</p>
                </div>
             </div>

             <div>
                <p className="text-xs uppercase font-bold text-gray-500 mb-2">Project Description</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-24">
                   <div className="h-2 w-3/4 bg-gray-300 rounded mb-3"></div>
                   <div className="h-2 w-1/2 bg-gray-300 rounded mb-3"></div>
                   <div className="h-2 w-5/6 bg-gray-300 rounded"></div>
                   <p className="text-[10px] text-gray-400 mt-3 italic text-center">UI Placeholder - short project description text</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-border flex flex-col gap-3">
           <div className="flex gap-4 w-full">
              <button className="flex-1 py-3 bg-primary text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-sm transition-transform active:scale-95">
                 <CheckCircle2 size={18} /> Accept Invitation
              </button>
              <button className="flex-1 py-3 bg-white border border-gray-300 text-primary rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-transform active:scale-95">
                 <XCircle size={18} /> Decline
              </button>
           </div>
           <p className="text-[10px] text-gray-500 font-medium">Invitation expires in <span className="font-bold">48 hours</span>.</p>
        </div>

      </div>
    </div>
  );
};

export default InvitationResponse;
