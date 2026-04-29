import React from 'react';
import { ShieldAlert, Check, X, Save, Users } from 'lucide-react';

const RolesAndPermissions = () => {
  const permissions = [
    { role: 'Project Owner', permissions: [true, true, true, true, true, true, true] },
    { role: 'Project Manager', permissions: [true, true, true, true, true, true, false] },
    { role: 'Team Member', permissions: [false, 'Own tasks only', false, false, false, false, false] },
  ];

  const headers = [
    'CREATE TASK', 'EDIT TASK', 'DELETE TASK', 
    'INVITE MEMBER', 'REMOVE MEMBER', 'VIEW ACTIVITY LOG', 'EDIT WORKSPACE SETTINGS'
  ];

  const members = [
    { name: 'James Dawson', role: 'PROJECT OWNER', email: 'james.dawson@workspace.io', status: 'PROTECTED', isUser: true },
    { name: 'Tom Nguyen', role: 'Team Member', email: 'tom.nguyen@workspace.io', status: 'ACTIVE', isUser: false }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard &gt; Settings &gt; Roles & Permissions</p>
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <ShieldAlert size={24}/> Roles & Permissions
          </h2>
          <p className="text-sm text-gray-500 mt-1">Define what each role can do and assign roles to workspace members.</p>
        </div>
      </div>

      {/* Non-Owner View Banner */}
      <div className="bg-gray-50 border border-border p-4 rounded-xl flex items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
            👁️
          </div>
          <p className="text-xs font-bold text-primary uppercase tracking-wider">
            View Only <span className="font-medium text-gray-500 normal-case ml-2">— You can view but not edit role assignments.</span>
          </p>
        </div>
        <span className="text-[9px] font-extrabold tracking-widest bg-gray-400 text-white px-2.5 py-1 rounded shadow-sm">NON-OWNER STATE</span>
      </div>

      {/* Permission Matrix */}
      <div className="bg-surface rounded-xl shadow-sm border border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Permission Matrix
          </h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase italic">Read-only reference</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-widest text-gray-500 bg-gray-50/30 font-extrabold">
                <th className="p-4 text-left w-48">Role</th>
                {headers.map((header, idx) => (
                  <th key={idx} className="p-4 text-center font-bold leading-snug max-w-[100px]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 text-left font-bold text-sm text-primary flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs">
                      {rIdx === 0 ? '👑' : rIdx === 1 ? '💼' : '👤'}
                    </div>
                    {row.role}
                  </td>
                  {row.permissions.map((perm, pIdx) => (
                    <td key={pIdx} className="p-4 text-center">
                      {perm === true ? (
                        <div className="mx-auto w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-inner">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : perm === false ? (
                        <div className="mx-auto w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shadow-inner">
                          <X size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="mx-auto text-[10px] font-bold text-gray-500 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1 shadow-sm">
                          {perm}
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

      {/* Assign Roles Section */}
      <div className="bg-surface rounded-xl shadow-sm border border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
            <Users size={14}/> Assign Roles to Members
          </h3>
          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded shadow-sm">5 Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/30 font-extrabold">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Member Name</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Change Role</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 text-center font-mono text-xs text-gray-400">{idx === 0 ? '01' : '05'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-8 h-8 rounded-full border shadow-inner" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-primary">{member.name}</p>
                          {member.isUser && (
                            <span className="text-[9px] font-extrabold bg-primary text-white px-1.5 py-0.5 rounded shadow-sm tracking-wide">YOU</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm uppercase ${member.isUser ? 'bg-primary text-white' : 'bg-gray-100 text-primary'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {member.isUser ? (
                      <input type="text" disabled placeholder="Cannot change Owner role" className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 p-2 rounded-lg w-56 cursor-not-allowed shadow-inner select-none" />
                    ) : (
                      <select className="text-xs font-bold text-primary bg-white border border-gray-300 p-2 rounded-lg w-56 shadow-sm focus:outline-none cursor-pointer">
                        <option>Team Member</option>
                        <option>Project Manager</option>
                      </select>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm uppercase ${member.isUser ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50/50 border-t border-border flex justify-end items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mr-auto">
             🔒 Only the Project Owner can save changes.
          </span>
          <button className="px-4 py-2 bg-white border border-gray-300 text-primary rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm transition-all cursor-pointer">
            Discard
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm flex items-center gap-2 transition-all cursor-pointer">
            <Save size={14}/> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolesAndPermissions;
