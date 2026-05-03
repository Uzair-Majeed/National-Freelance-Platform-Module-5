import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, Save, Users, Loader2, ShieldCheck, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { roleApi, workspaceApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

const PERMISSION_KEYS = [
  { key: 'CREATE_TASK',             label: 'CREATE TASK' },
  { key: 'EDIT_TASK',               label: 'EDIT TASK' },
  { key: 'DELETE_TASK',             label: 'DELETE TASK' },
  { key: 'INVITE_MEMBER',           label: 'INVITE MEMBER' },
  { key: 'REMOVE_MEMBER',           label: 'REMOVE MEMBER' },
  { key: 'VIEW_ACTIVITY_LOG',       label: 'VIEW ACTIVITY LOG' },
  { key: 'ASSIGN_ROLE',             label: 'ASSIGN ROLE' },
  { key: 'EDIT_WORKSPACE_SETTINGS', label: 'EDIT WORKSPACE SETTINGS' },
];

const ROLE_EMOJIS = { ADMIN: '👑', MANAGER: '💼', MEMBER: '👤' };

import LoadingSpinner from '../components/LoadingSpinner';

const RolesAndPermissions = () => {
  const [roles, setRoles]     = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [canAssignRole, setCanAssignRole]   = useState(false);

  const { workspaceId } = useWorkspace();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, membersRes, permRes] = await Promise.all([
        roleApi.getByWorkspace(workspaceId),
        workspaceApi.getMembers(workspaceId),
        roleApi.checkPermission(workspaceId, 'ASSIGN_ROLE')
      ]);
      if (rolesRes.success) setRoles(rolesRes.data);
      if (membersRes.success) setMembers(membersRes.data);
      if (permRes.success) setCanAssignRole(permRes.data.allowed);
      setPendingChanges({});
    } catch (err) {
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!workspaceId) return;
    fetchData();
  }, [workspaceId]);

  const handleRoleSelect = (userId, roleName) => {
    setPendingChanges((prev) => ({ ...prev, [userId]: roleName }));
  };

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    setSaving(true);
    try {
      const promises = Object.entries(pendingChanges).map(([userId, roleName]) => {
        const role = roles.find((r) => r.role_name === roleName);
        if (!role) return Promise.resolve();
        return roleApi.assignRole(workspaceId, userId, role.role_id);
      });
      await Promise.all(promises);
      toast.success('Roles updated successfully!');
      await fetchData();
    } catch (err) {
      toast.error('Failed to update roles: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const hasPermission = (role, key) => {
    const p = role.permissions || {};
    return p['*'] === true || p[key] === true;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const btnClass = "px-8 py-3 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg flex items-center gap-3 active:scale-95";

  return (
    <div className="flex flex-col gap-8 w-full pb-12 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-sm text-gray-800 uppercase font-black tracking-[0.2em] mb-1">AUTHORIZATION PROTOCOLS</p>
          <h2 className="text-3xl font-black text-primary flex items-center gap-3">
            <ShieldCheck size={28} /> Roles & Authority
          </h2>
          <p className="text-xs font-black text-gray-800 uppercase tracking-widest mt-2">OPERATIONAL ACCESS MATRICES</p>
        </div>
      </div>

      <div className="bg-white border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-lg transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-lg shrink-0">
            <Key size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-primary uppercase tracking-widest">
              Authority Status: <span className={canAssignRole ? 'text-green-600' : 'text-red-500'}>
                {canAssignRole ? 'ADMINISTRATIVE PRIVILEGE' : 'RESTRICTED VIEW'}
              </span>
            </p>
            <p className="text-xs text-gray-800 font-black uppercase mt-1">Operational roles are managed by leads.</p>
          </div>
        </div>
        <span className="text-xs font-black bg-surface-alt border border-border text-primary px-4 py-2 rounded-xl uppercase tracking-widest shrink-0">
          {roles.length} ROLES DEFINED
        </span>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Access Matrix</h3>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-center border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-gray-800 bg-white font-black">
                <th className="p-6 text-left w-56">DESIGNATION</th>
                {PERMISSION_KEYS.map((h) => (
                  <th key={h.key} className="p-4 text-center font-black leading-tight max-w-[110px]">{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {roles.map((role) => (
                <tr key={role.role_id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="p-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm shrink-0 group-hover:border-primary group-hover:shadow-md transition-all">
                        {ROLE_EMOJIS[role.role_name] || '🏷️'}
                      </div>
                      <span className="text-sm font-black text-primary uppercase tracking-tight group-hover:translate-x-1 transition-transform">{role.role_name}</span>
                    </div>
                  </td>
                  {PERMISSION_KEYS.map((h) => (
                    <td key={h.key} className="p-4">
                      {hasPermission(role, h.key) ? (
                        <div className="mx-auto w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Check size={16} strokeWidth={4} />
                        </div>
                      ) : (
                        <div className="mx-auto w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <X size={16} strokeWidth={4} />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment */}
      <div className="bg-white rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <Users size={20} /> Authorization Control
          </h3>
          <span className="text-xs font-black bg-white border border-border px-3 py-1 rounded-lg uppercase tracking-widest">{members.length} UNITS</span>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-gray-800 bg-white font-black">
                <th className="p-6 w-20 text-center">ID</th>
                <th className="p-6">Member Identity</th>
                <th className="p-6">Current Role</th>
                <th className="p-6">Reassign To</th>
                <th className="p-6 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member, idx) => {
                const currentRole = pendingChanges[member.user_id] || member.role_name;
                return (
                  <tr key={member.user_id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="p-6 text-center font-black text-xs text-gray-400 group-hover:text-primary">#{String(idx + 1).padStart(2, '0')}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-xs font-black text-primary shadow-sm shrink-0 group-hover:border-primary group-hover:shadow-md transition-all">
                          {String(member.user_id || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-primary uppercase tracking-tight group-hover:translate-x-1 transition-transform">{member.email || 'Unknown Entity'}</p>
                          <p className="text-xs text-gray-800 font-black uppercase tracking-widest mt-1">UID: {member.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`text-xs font-black tracking-[0.2em] px-3 py-1.5 rounded-lg border border-transparent uppercase transition-all ${currentRole === 'ADMIN' ? 'bg-black text-white shadow-md group-hover:bg-white group-hover:text-black group-hover:border-black' : 'bg-surface-alt text-primary group-hover:bg-white group-hover:border-border'}`}>
                        {currentRole || 'MEMBER'}
                      </span>
                    </td>
                    <td className="p-6">
                      {member.role_name === 'ADMIN' || !canAssignRole ? (
                        <div className="bg-gray-100 border border-border p-3 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest w-64 shadow-inner">
                          ACCESS RESTRICTED
                        </div>
                      ) : (
                        <select
                          value={currentRole || 'MEMBER'}
                          onChange={(e) => handleRoleSelect(member.user_id, e.target.value)}
                          className="text-xs font-black text-primary bg-white border border-border p-3 rounded-xl w-64 shadow-sm focus:outline-none cursor-pointer uppercase tracking-widest hover:border-black transition-all"
                        >
                          {roles.map((r) => (
                            <option key={r.role_id} value={r.role_name}>{r.role_name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-6 text-right text-xs font-black text-gray-800 uppercase tracking-widest whitespace-nowrap">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {canAssignRole && (
          <div className="p-8 bg-gray-50/50 border-t border-border flex flex-col sm:flex-row justify-end items-center gap-6">
            <span className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] mr-auto italic text-center sm:text-left">
              * Commit authorization updates to persist.
            </span>
            <div className="flex gap-4 w-full sm:w-auto">
              <button onClick={() => setPendingChanges({})} className={btnClass}>
                Discard
              </button>
              <button onClick={handleSave} disabled={saving || Object.keys(pendingChanges).length === 0} className={btnClass}>
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {saving ? 'COMMITTING...' : 'Commit Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesAndPermissions;
