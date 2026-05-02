import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, X, Mail, Clock, CheckCircle, AlertCircle, Send, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { workspaceApi, roleApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

import LoadingSpinner from '../components/LoadingSpinner';

const TeamManagement = () => {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();

  const [members, setMembers]         = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting]       = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [permissions, setPermissions]       = useState({ invite: false, remove: false });

  const fetchData = async () => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      const [memRes, invRes, invitePerm, removePerm] = await Promise.all([
        workspaceApi.getMembers(workspaceId),
        workspaceApi.getInvitations(workspaceId),
        roleApi.checkPermission(workspaceId, 'INVITE_MEMBER'),
        roleApi.checkPermission(workspaceId, 'REMOVE_MEMBER')
      ]);
      if (memRes.success)  setMembers(memRes.data);
      if (invRes.success)  setInvitations(invRes.data);
      setPermissions({
        invite: invitePerm.success ? invitePerm.data.allowed : false,
        remove: removePerm.success ? removePerm.data.allowed : false
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!workspaceId) { navigate('/'); return; }
    fetchData();
  }, [workspaceId, navigate]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      setInviting(true);
      await workspaceApi.inviteUser(workspaceId, inviteEmail.trim());
      setInviteEmail('');
      setShowInviteForm(false);
      toast.success('Invitation sent successfully');
      await fetchData();
    } catch (err) {
      toast.error('Failed to invite: ' + err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await workspaceApi.removeMember(workspaceId, userId);
      setMembers(members.filter(m => m.user_id !== userId));
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member: ' + err.message);
    }
  };

  const pendingInvites  = invitations.filter(i => i.status === 'PENDING');

  const INVITE_STATUS_STYLES = {
    PENDING:  { icon: <Clock size={14} />, badge: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
    ACCEPTED: { icon: <CheckCircle size={14} />, badge: 'bg-green-50 text-green-700 border-green-100' },
    DECLINED: { icon: <AlertCircle size={14} />, badge: 'bg-red-50 text-red-700 border-red-100' },
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const btnClass = "flex items-center justify-center gap-2 px-6 py-3 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95";

  return (
    <div className="flex flex-col gap-8 w-full pb-12 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-sm text-gray-800 uppercase font-black tracking-[0.2em] mb-1">PERSONNEL MANAGEMENT</p>
          <h2 className="text-3xl font-black text-primary flex items-center gap-3"><Users size={28} /> Team Network</h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-xs font-black text-gray-800 uppercase tracking-widest">{members.length} VERIFIED MEMBERS · {pendingInvites.length} PENDING</p>
          </div>
        </div>
        {permissions.invite && (
          <button onClick={() => setShowInviteForm(!showInviteForm)} className={btnClass}>
            <UserPlus size={18} /> Recruit Member
          </button>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-white border border-border rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2"><Mail size={18} /> Initialize Invitation</h3>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="COLLEAGUE@ORG.COM"
              className="w-full sm:flex-1 p-4 border border-border rounded-xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary bg-gray-50 shadow-inner"
            />
            <button type="submit" disabled={inviting} className={btnClass + " w-full sm:w-auto"}>
              {inviting ? 'SENDING…' : 'SEND INVITE'}
            </button>
            <button type="button" onClick={() => setShowInviteForm(false)} className={btnClass + " w-full sm:w-auto"}>
              Abort
            </button>
          </form>
        </div>
      )}

      {/* Members Section */}
      <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Active Directory</h3>
          <span className="text-xs font-black bg-white border border-border text-primary px-3 py-1 rounded-lg uppercase tracking-widest">{members.length} UNITS</span>
        </div>
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-gray-800 bg-white font-black">
                <th className="p-6 w-20 text-center">ID</th>
                <th className="p-6">Identity</th>
                <th className="p-6">Authorization</th>
                <th className="p-6">Activation</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.length > 0 ? members.map((m, i) => (
                <tr key={m.user_id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="p-6 text-center font-black text-xs text-gray-400 group-hover:text-primary">#{String(i + 1).padStart(2, '0')}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-xs font-black text-primary shadow-sm group-hover:border-primary group-hover:shadow-md transition-all shrink-0">
                        {(m.email || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary uppercase tracking-tight group-hover:translate-x-1 transition-transform">{m.email}</p>
                        <p className="text-xs text-gray-800 font-black uppercase tracking-widest mt-1">UID: {m.user_id.slice(0, 12)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-xs font-black tracking-[0.2em] px-3 py-1.5 rounded-lg border border-transparent uppercase shadow-none flex items-center gap-2 w-fit transition-all ${m.role_name === 'ADMIN' ? 'bg-black text-white shadow-md group-hover:bg-white group-hover:text-black group-hover:border-black' : 'bg-surface-alt text-primary group-hover:bg-white group-hover:border-border'}`}>
                      <ShieldCheck size={12} /> {m.role_name || 'MEMBER'}
                    </span>
                  </td>
                  <td className="p-6 text-xs font-black text-gray-800 uppercase tracking-widest whitespace-nowrap">{new Date(m.joined_at).toLocaleDateString()}</td>
                  <td className="p-6 text-right">
                    {m.role_name !== 'ADMIN' && permissions.remove ? (
                      <button onClick={() => handleRemove(m.user_id)} className="text-xs font-black text-white bg-black border border-black px-5 py-2.5 rounded-xl shadow-md hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em]">
                        TERMINATE
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-black uppercase tracking-widest italic">Immutable</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-16 text-center text-gray-800 font-black uppercase tracking-[0.2em]">Zero Personnel Detected</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invitations Section */}
      <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Pending Invites</h3>
        </div>
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-gray-800 bg-white font-black">
                <th className="p-6 w-20 text-center">#</th>
                <th className="p-6">Email Address</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invitations.length > 0 ? invitations.map((inv, i) => {
                const style = INVITE_STATUS_STYLES[inv.status] || INVITE_STATUS_STYLES.PENDING;
                return (
                  <tr key={inv.invitation_id} className="hover:bg-gray-50/80 transition-all">
                    <td className="p-6 text-center font-black text-xs text-gray-400">#{String(i + 1).padStart(2, '0')}</td>
                    <td className="p-6 text-xs font-black text-primary uppercase tracking-widest">{inv.invitee_email}</td>
                    <td className="p-6">
                      <span className={`text-xs font-black tracking-[0.2em] px-3 py-1.5 rounded-lg border shadow-none flex w-fit items-center gap-2 ${style.badge}`}>
                        {style.icon} {inv.status}
                      </span>
                    </td>
                    <td className="p-6 text-right text-xs font-black text-gray-800 uppercase tracking-widest">{new Date(inv.invited_at).toLocaleDateString()}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4" className="p-16 text-center text-gray-800 font-black uppercase tracking-[0.2em]">No Active Linkages</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
