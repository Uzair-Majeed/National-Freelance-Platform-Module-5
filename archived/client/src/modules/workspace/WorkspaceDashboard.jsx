import React from 'react';
import { Share2, Plus, Users, Layout, Clock, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react';

const WorkspaceDashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Workspace</p>
          <h2 className="text-2xl font-semibold text-primary">Project Workspace — [Project Name]</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-opacity-90">
            <Plus size={16} /> New Action
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Team Members */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold flex items-center gap-2"><Users size={18}/> Team Members</h3>
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">4 Active</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {[
                { name: 'Alex Rivera', role: 'OWNER', email: 'alex@company.com' },
                { name: 'Sarah Chen', role: 'PM', email: 'sarah@company.com' },
                { name: 'Marcus Johnson', role: 'MEMBER', email: 'marcus@company.com' },
                { name: 'Elena Rostova', role: 'MEMBER', email: 'elena@company.com' }
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-600">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
              <Plus size={16}/> Invite Member
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-3 cursor-pointer hover:border-gray-400">
               <Layout className="text-gray-400"/>
               <div>
                 <p className="text-sm font-semibold">Task Board</p>
                 <p className="text-xs text-gray-500">Manage sprints & tickets</p>
               </div>
             </div>
             <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-3 cursor-pointer hover:border-gray-400">
               <Users className="text-gray-400"/>
               <div>
                 <p className="text-sm font-semibold">Team Management</p>
                 <p className="text-xs text-gray-500">Roles, access & capacity</p>
               </div>
             </div>
          </div>
        </div>

        {/* Middle Column - Task Progress */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-6 h-[400px] flex flex-col">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold flex items-center gap-2"><CheckCircle2 size={18}/> Task Progress</h3>
              <button className="text-gray-400 hover:text-primary">...</button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* Fake Donut Chart */}
              <div className="w-40 h-40 rounded-full border-[12px] border-gray-100 border-t-primary border-r-primary flex items-center justify-center transform -rotate-45">
                 <div className="transform rotate-45 text-center">
                   <p className="text-3xl font-bold text-primary">62%</p>
                   <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Complete</p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Tasks</p>
                <p className="text-xl font-bold">25</p>
              </div>
              <div className="bg-primary text-white p-4 rounded-lg">
                <p className="text-xs text-gray-300 mb-1">Completed</p>
                <p className="text-xl font-bold">15</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">In Progress</p>
                <p className="text-xl font-bold">7</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Overdue</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-3 cursor-pointer hover:border-gray-400">
             <Clock className="text-gray-400"/>
             <div>
               <p className="text-sm font-semibold">Activity Log</p>
               <p className="text-xs text-gray-500">Full audit trail & history</p>
             </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6 h-[492px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold flex items-center gap-2"><PlayCircle size={18}/> Recent Activity</h3>
            <span className="text-[10px] font-bold tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> LIVE
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 relative">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200"></div>
            <div className="space-y-6">
               {[
                 { user: 'Alex Rivera', action: 'completed task "API Integration"', time: '10 mins ago', icon: <CheckCircle2 size={12} className="text-green-500" /> },
                 { user: 'Sarah Chen', action: 'commented on "Design Specs"', time: '1 hour ago', detail: '"Updated the wireframes to match..."', icon: <Users size={12} className="text-blue-500" /> },
                 { user: 'Marcus J.', action: 'uploaded assets_v2.zip', time: '3 hours ago', icon: <Layout size={12} className="text-purple-500" /> },
                 { user: 'System', action: 'created new branch feature/auth', time: 'Yesterday, 4:20 PM', icon: <AlertCircle size={12} className="text-orange-500" /> },
                 { user: 'Alex Rivera', action: 'invited Elena R.', time: 'Yesterday, 10:00 AM', icon: <Users size={12} className="text-gray-500" /> },
               ].map((act, i) => (
                 <div key={i} className="flex gap-4 relative z-10">
                   <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                     {act.icon}
                   </div>
                   <div>
                     <p className="text-sm"><span className="font-semibold">{act.user}</span> {act.action}</p>
                     {act.detail && <p className="text-xs text-gray-500 mt-1 italic border-l-2 border-gray-200 pl-2">{act.detail}</p>}
                     <p className="text-xs text-gray-400 mt-1">{act.time}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
          
          <button className="w-full mt-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
            View Full Log &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default WorkspaceDashboard;
