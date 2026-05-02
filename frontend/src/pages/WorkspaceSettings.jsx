import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Save, Globe, ArrowLeft, Database, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { workspaceApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

const WorkspaceSettings = () => {
  const navigate = useNavigate();
  const { workspaceId, workspaceName, setWorkspace, clearWorkspace } = useWorkspace();
  const [wsName, setWsName] = useState(workspaceName || '');
  const [wsDesc, setWsDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const activeUserId = localStorage.getItem('activeUserId');

  const generalRef = useRef(null);
  const memberRef = useRef(null);
  const storageRef = useRef(null);
  const securityRef = useRef(null);
  const dangerRef = useRef(null);

  useEffect(() => {
    if (!workspaceId) return;
    const fetchData = async () => {
      try {
        const [wsRes, memRes] = await Promise.all([
          workspaceApi.getById(workspaceId),
          workspaceApi.getMembers(workspaceId)
        ]);
        
        if (wsRes.success) {
          setWsName(wsRes.data.name);
          setWsDesc('STRATEGIC OPERATIONAL CORE FOR COLLABORATIVE TASK EXECUTION.');
        }

        if (memRes.success) {
          const currentMember = memRes.data.find(m => String(m.user_id) === String(activeUserId));
          setIsAdmin(currentMember?.role_name === 'ADMIN');
        }
      } catch (err) {
        console.error('Failed to fetch settings data:', err);
      }
    };
    fetchData();
  }, [workspaceId, activeUserId]);

  const handleSave = async () => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      await workspaceApi.update(workspaceId, { name: wsName });
      setWorkspace(workspaceId, wsName);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async () => {
    if (!workspaceId) return;
    if (!window.confirm('Delete this workspace permanently? This action is irreversible.')) return;
    try {
      setLoading(true);
      await workspaceApi.delete(workspaceId);
      toast.success('Workspace purged successfully');
      clearWorkspace();
      navigate('/');
    } catch (err) {
      toast.error('Failed to purge workspace: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!workspaceId || !activeUserId) return;
    if (!window.confirm('Are you sure you want to leave this workspace? You will lose all access.')) return;
    try {
      setLoading(true);
      await workspaceApi.removeMember(workspaceId, activeUserId);
      toast.success('You have left the workspace');
      clearWorkspace();
      navigate('/');
    } catch (err) {
      toast.error('Failed to leave workspace: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const btnClass = "flex items-center justify-center gap-2 px-8 py-4 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95";
  const redBtn = "flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white border border-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all shadow-lg active:scale-95";

  return (
    <div className="flex flex-col gap-8 h-full pb-10">
      <button onClick={() => navigate(-1)} className={btnClass + " self-start"}>
        <ArrowLeft size={16} /> Return to Hub
      </button>

      <div className="flex flex-col lg:flex-row gap-10 flex-1">

        {/* Navigation */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6">
          <nav className="flex lg:flex-col flex-wrap gap-4">
            {[
              { label: 'Core Details', icon: <Globe size={16} />, ref: generalRef, hidden: !isAdmin },
              { label: 'Personnel', icon: <Users size={16} />, ref: memberRef },
              { label: 'Data Quotas', icon: <Database size={16} />, ref: storageRef },
              { label: 'Protocols', icon: <ShieldAlert size={16} />, ref: securityRef, hidden: !isAdmin },
              { label: 'Exit Vector', icon: <AlertTriangle size={16} />, ref: dangerRef, color: 'text-red-600' }
            ].filter(i => !i.hidden).map((item, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(item.ref)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all text-left hover:bg-surface-alt ${item.color || 'text-gray-800'}`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar lg:pr-6 max-h-[calc(100vh-15rem)]">

          {/* Core Details */}
          {isAdmin && (
            <div ref={generalRef} className="bg-white rounded-3xl border border-border p-6 md:p-10 shadow-sm hover:shadow-lg transition-all scroll-mt-6">
              <h4 className="text-sm uppercase font-black tracking-[0.3em] text-primary flex items-center gap-3 mb-10">
                <Globe size={20} /> Strategic Context
              </h4>
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-widest">Workspace Designation</label>
                  <input type="text" value={wsName} onChange={(e) => setWsName(e.target.value)} className="border border-border rounded-xl p-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary bg-gray-50 shadow-inner w-full text-primary" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-widest">Operational Directive</label>
                  <textarea rows={3} value={wsDesc} onChange={(e) => setWsDesc(e.target.value)} className="border border-border rounded-xl p-4 text-xs font-bold focus:outline-none focus:border-primary bg-gray-50 shadow-inner w-full text-primary leading-relaxed uppercase tracking-wider" />
                </div>
              </div>
            </div>
          )}

          {/* Personnel Hub */}
          <div ref={memberRef} className="bg-white rounded-3xl border border-border p-6 md:p-10 shadow-sm hover:shadow-lg transition-all scroll-mt-6">
            <h4 className="text-sm uppercase font-black tracking-[0.3em] text-primary flex items-center gap-3 mb-10">
              <Users size={20} /> Personnel Hub
            </h4>
            <div className="bg-surface-alt rounded-2xl p-6 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-black text-primary uppercase tracking-widest">Active Member Directory</p>
                <p className="text-xs font-black text-gray-800 uppercase mt-1">Recruit, manage, and audit team permissions.</p>
              </div>
              <button onClick={() => navigate('/team')} className={btnClass}>
                Launch Personnel Hub
              </button>
            </div>
          </div>

          {/* Data Quotas */}
          <div ref={storageRef} className="bg-white rounded-3xl border border-border p-6 md:p-10 shadow-sm hover:shadow-lg transition-all scroll-mt-6">
            <h4 className="text-sm uppercase font-black tracking-[0.3em] text-primary flex items-center gap-3 mb-10">
              <Database size={20} /> Storage Capacity
            </h4>
            <div className="space-y-8">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <span className="font-black text-xs text-primary uppercase tracking-widest">4.2 GB / 15.0 GB LOADED</span>
                  <span className="text-xs font-black text-primary bg-surface-alt px-2 py-1 rounded border border-border shadow-sm">28% UTILIZED</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-primary w-[28%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Protocols */}
          {isAdmin && (
            <div ref={securityRef} className="bg-white rounded-3xl border border-border p-6 md:p-10 shadow-sm hover:shadow-lg transition-all scroll-mt-6">
              <h4 className="text-sm uppercase font-black tracking-[0.3em] text-primary flex items-center gap-3 mb-10">
                <ShieldAlert size={20} /> Security Infrastructure
              </h4>
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-border shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <ShieldAlert size={32} className="text-primary" />
                    <div>
                      <p className="text-xs font-black text-primary uppercase tracking-widest">Enforce Multi-Factor Sequence</p>
                      <p className="text-xs font-black text-gray-800 uppercase mt-1">Verification protocols for all personnel.</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-6 h-6 rounded border-border text-primary focus:ring-0 cursor-pointer shadow-sm" />
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone / Exit Vector */}
          <div ref={dangerRef} className="bg-red-600 border border-red-700 p-6 md:p-10 rounded-3xl shadow-xl transition-all scroll-mt-6">
            <h4 className="text-sm uppercase font-black tracking-[0.3em] text-white flex items-center gap-3 mb-10">
              <AlertTriangle size={20} /> {isAdmin ? 'Critical Termination' : 'Operational Exit'}
            </h4>
            <div className="p-6 md:p-8 bg-white/10 border border-white/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest">
                  {isAdmin ? 'Erase Matrix Hierarchy' : 'Sever Local Connection'}
                </p>
                <p className="text-xs font-black text-white/90 uppercase mt-2">
                  {isAdmin ? 'PERMANENTLY WIPES ALL LOGS AND ASSETS.' : 'YOU WILL LOSE ALL ACCESS TO THIS WORKSPACE.'}
                </p>
              </div>
              {isAdmin ? (
                <button onClick={handlePurge} disabled={loading} className={redBtn + " w-full md:w-auto shadow-2xl"}>
                  PURGE WORKSPACE
                </button>
              ) : (
                <button onClick={handleLeave} disabled={loading} className={redBtn + " w-full md:w-auto shadow-2xl"}>
                  LEAVE WORKSPACE
                </button>
              )}
            </div>
          </div>

          {/* Save Footer - Only for Admins */}
          {isAdmin && (
            <div className="flex justify-end items-center gap-4 pt-10 border-t border-border">
              <button onClick={() => navigate(-1)} className={btnClass}>Abort</button>
              <button onClick={handleSave} disabled={loading} className={btnClass}>
                <Save size={18} /> {loading ? 'SAVING...' : 'Commit Settings'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
