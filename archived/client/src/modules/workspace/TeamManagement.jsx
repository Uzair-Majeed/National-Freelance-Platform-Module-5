import React from 'react';
import { Users, UserPlus, Search, Filter, MoreHorizontal, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const TeamManagement = () => {
  const members = [
    { name: 'Alex Rivera', role: 'PROJECT OWNER', email: 'alex@company.com', status: 'Active', joined: 'Jan 12, 2024' },
    { name: 'Sarah Chen', role: 'Project Manager', email: 'sarah@company.com', status: 'Active', joined: 'Feb 3, 2024' },
    { name: 'Marcus Johnson', role: 'Member', email: 'marcus@company.com', status: 'Active', joined: 'Feb 15, 2024' },
    { name: 'Elena Rostova', role: 'Member', email: 'elena@company.com', status: 'Pending', joined: 'Invited Mar 1, 2024' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard &gt; Team Management</p>
          <h2 className="text-2xl font-semibold text-primary">Team Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage workspace members, roles, and access permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
            <Users size={16} /> Manage Roles & Permissions
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-opacity-90">
            <UserPlus size={16} /> Invite Member
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500"><Users size={20}/></div>
           <div><p className="text-xl font-bold">4</p><p className="text-xs text-gray-500">Total Members</p></div>
        </div>
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><CheckCircle2 size={20}/></div>
           <div><p className="text-xl font-bold">3</p><p className="text-xs text-gray-500">Active</p></div>
        </div>
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600"><UserPlus size={20}/></div>
           <div><p className="text-xl font-bold">1</p><p className="text-xs text-gray-500">Pending Invite</p></div>
        </div>
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Search size={20}/></div>
           <div><p className="text-xl font-bold">3</p><p className="text-xs text-gray-500">Roles Assigned</p></div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface rounded-xl shadow-sm border border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50">
           <div className="flex gap-3">
             <div className="relative">
               <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search members..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary" />
             </div>
             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50">
               <Filter size={16} /> Filter by Role
             </button>
             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50">
                Status
             </button>
           </div>
           <span className="text-sm text-gray-500">Showing 4 of 4 members</span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
              <th className="p-4 w-12 text-center"><input type="checkbox" className="rounded text-primary focus:ring-primary"/></th>
              <th className="p-4">Avatar</th>
              <th className="p-4">Member Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <tr key={i} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center"><input type="checkbox" className="rounded text-primary focus:ring-primary"/></td>
                <td className="p-4">
                  <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-10 h-10 rounded-full" />
                </td>
                <td className="p-4">
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">Joined {member.joined}</p>
                </td>
                <td className="p-4 text-sm text-gray-600">{member.email}</td>
                <td className="p-4">
                  {member.role === 'PROJECT OWNER' ? (
                     <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">{member.role}</span>
                  ) : (
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium bg-white hover:bg-gray-50">
                      {member.role} <span className="text-gray-400">▼</span>
                    </button>
                  )}
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${member.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    {member.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {member.role === 'PROJECT OWNER' ? (
                     <span className="text-sm text-gray-400 italic">Owner</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                       <button className="text-sm font-medium text-gray-600 hover:text-primary">Change Role</button>
                       <span className="text-gray-300">|</span>
                       <button className="text-sm font-medium text-red-500 hover:text-red-700">Remove ✕</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 flex justify-between items-center text-sm text-gray-500">
          <span>4 members total &middot; 1 pending invitation</span>
          <div className="flex items-center gap-2">
             <button className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
             <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded">1</span>
             <button className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
      
      {/* Bottom informational cards based on screenshot */}
      <div className="grid grid-cols-2 gap-6 mt-4">
         <div className="bg-surface rounded-xl shadow-sm border border-border p-6 flex items-start gap-4">
            <div>
               <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-4">Role Legend</h4>
               <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded shrink-0">PROJECT OWNER</span>
                    <p className="text-xs text-gray-600">Full control - assign roles - remove members.</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <span className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded shrink-0">PROJECT MANAGER</span>
                    <p className="text-xs text-gray-600">Manage tasks & milestones.</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <span className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded shrink-0">MEMBER</span>
                    <p className="text-xs text-gray-600">View & contribute to tasks.</p>
                 </div>
               </div>
            </div>
         </div>
         
         <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-4">Pending Invitations</h4>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">E</div>
                  <div>
                    <p className="text-sm font-semibold">elena@company.com</p>
                    <p className="text-xs text-gray-500">Sent: Mar 1, 2024</p>
                  </div>
               </div>
               <button className="text-sm font-medium text-gray-500 hover:text-primary">Resend</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TeamManagement;
