import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import InviteModal from '../components/InviteModal';
import { workspaceApi } from '../api';

const TeamManagement = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [workspaceId, setWorkspaceId] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const wsData = await workspaceApi.getByProject('123e4567-e89b-12d3-a456-426614174000');
        if (wsData.success && wsData.data.length > 0) {
          const wsId = wsData.data[0].workspace_id;
          setWorkspaceId(wsId);
          const memData = await workspaceApi.getMembers(wsId);
          if (memData.success) {
            setMembers(memData.data);
          }
        }
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleRemoveMember = async (userId) => {
    if (!window.confirm(`Are you sure you want to remove this member?`)) return;
    try {
      await workspaceApi.removeMember(workspaceId, userId);
      setMembers(members.filter(m => m.user_id !== userId));
      alert('Member removed successfully');
    } catch (err) {
      alert('Failed to remove member: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard &gt; Team Management</p>
          <h2 className="text-2xl font-semibold text-primary">Team Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage workspace members, roles, and access permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Role & Permissions management coming soon in Module 6!')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <Users size={16} /> Manage Roles & Permissions
          </button>
          <button onClick={() => setIsInviteOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-all">
            <UserPlus size={16} /> Invite Member
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            <Users size={20}/>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">{members.length}</p>
            <p className="text-xs text-gray-500 font-medium">Total Members</p>
          </div>
        </div>
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle2 size={20}/>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">{members.length}</p>
            <p className="text-xs text-gray-500 font-medium">Active</p>
          </div>
        </div>
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
            <UserPlus size={20}/>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">0</p>
            <p className="text-xs text-gray-500 font-medium">Pending Invite</p>
          </div>
        </div>
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Users size={20}/>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">3</p>
            <p className="text-xs text-gray-500 font-medium">Roles Assigned</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface rounded-xl shadow-sm border border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-gray-50/50">
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search members..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary w-full md:w-64 transition-all bg-white" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-all">
              <Filter size={16} /> Filter by Role
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-all">
              Status
            </button>
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Showing 4 of 4 members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary"/>
                </th>
                <th className="p-4">Avatar</th>
                <th className="p-4">Member Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? members.map((member, i) => (
                <tr key={i} className="border-b border-border hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary"/>
                  </td>
                  <td className="p-4">
                    <img src={`https://ui-avatars.com/api/?name=${member.user_id}&background=random`} alt={member.user_id} className="w-10 h-10 rounded-full shadow-sm border border-white" />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-sm text-primary">User {member.user_id.slice(0,8)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">user_{member.user_id.slice(0,4)}@example.com</td>
                  <td className="p-4">
                    {member.role_name === 'Admin' ? (
                      <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm">{member.role_name}</span>
                    ) : (
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 transition-all text-primary shadow-sm">
                        {member.role_name || 'Member'} <span className="text-gray-400 text-[10px]">▼</span>
                      </button>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-600`}>
                      <span className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></span>
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {member.role_name === 'Admin' ? (
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest select-none">— (You)</span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => alert('Role adjustment coming soon!')}
                          className="text-xs font-bold text-gray-600 hover:text-primary px-3 py-1.5 border border-gray-300 rounded-lg bg-white shadow-sm transition-all"
                        >
                          Change Role
                        </button>
                        <button 
                          onClick={() => handleRemoveMember(member.user_id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 border border-gray-300 rounded-lg bg-white shadow-sm transition-all"
                        >
                          Remove ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-400">No members found in workspace.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex justify-between items-center text-xs text-gray-500 bg-gray-50/50 border-t border-border">
          <span className="font-medium">4 members total &middot; 1 pending invitation</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all" disabled>
              <ChevronLeft size={16}/>
            </button>
            <span className="w-8 h-8 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-lg shadow-sm">1</span>
            <button className="p-1.5 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all" disabled>
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom informational sections based on screenshots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col md:col-span-2">
          <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <Users size={14}/> Role Legend
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded self-start shadow-sm">PROJECT OWNER</span>
              <p className="text-xs font-medium text-gray-500 leading-relaxed">Full control &middot; assign roles &middot; remove members</p>
            </div>
            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="bg-gray-200 text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded self-start">PROJECT MANAGER</span>
              <p className="text-xs font-medium text-gray-500 leading-relaxed">Manage tasks & milestones securely</p>
            </div>
            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="bg-gray-200 text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded self-start">MEMBER</span>
              <p className="text-xs font-medium text-gray-500 leading-relaxed">View & contribute to allocated goals</p>
            </div>
          </div>
        </div>
         
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col">
          <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-4">Pending Invitations</h4>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200 mt-auto shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner">E</div>
              <div>
                <p className="text-sm font-bold text-primary truncate max-w-[140px]">elena@company.com</p>
                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Sent Mar 1, 2024</p>
              </div>
            </div>
            <button className="text-xs font-bold text-gray-500 hover:text-primary bg-white border border-gray-300 hover:border-primary transition-all px-2.5 py-1.5 rounded-lg shadow-sm">Resend</button>
          </div>
        </div>
      </div>

      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};

export default TeamManagement;
