import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Plus, Users, Layout, Clock, CheckCircle2, AlertCircle, PlayCircle, Kanban, MessageSquare } from 'lucide-react';
import QuickActionsModal from '../components/QuickActionsModal';
import { toast } from 'react-hot-toast';
import { workspaceApi, taskApi, activityApi, roleApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

import LoadingSpinner from '../components/LoadingSpinner';

const WorkspaceDashboard = () => {
  const navigate = useNavigate();
  const { workspaceId, workspaceName } = useWorkspace();

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [permissions, setPermissions] = useState({
    viewActivity: false,
    inviteMember: false,
    createTask: false,
  });

  useEffect(() => {
    if (!workspaceId) { navigate('/'); return; }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [memRes, taskRes, actRes, p1, p2, p3] = await Promise.all([
          workspaceApi.getMembers(workspaceId),
          taskApi.getByWorkspace(workspaceId),
          activityApi.getByWorkspace(workspaceId),
          roleApi.checkPermission(workspaceId, 'VIEW_ACTIVITY_LOG'),
          roleApi.checkPermission(workspaceId, 'INVITE_MEMBER'),
          roleApi.checkPermission(workspaceId, 'CREATE_TASK'),
        ]);
        if (memRes.success) setMembers(memRes.data);
        if (taskRes.success) setTasks(taskRes.data);
        if (actRes.success) setActivities(actRes.data);
        setPermissions({
          viewActivity: p1.success ? p1.data.allowed : false,
          inviteMember: p2.success ? p2.data.allowed : false,
          createTask: p3.success ? p3.data.allowed : false,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId, navigate]);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'DONE').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const overdue = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'DONE').length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Workspace link copied!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-full gap-3 text-center"><AlertCircle size={36} className="text-red-400" /><p className="text-sm text-gray-800">{error}</p></div>;
  }

  const blackBtn = "flex items-center gap-2 px-6 py-3 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95";
  const whiteBtn = "flex items-center gap-2 px-6 py-3 bg-white text-black border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg active:scale-95";

  return (
    <div className="flex flex-col gap-6 w-full lg:h-[calc(100vh-7.5rem)] overflow-y-auto lg:overflow-hidden pb-12 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <p className="text-sm text-gray-800 uppercase font-black tracking-[0.2em] mb-1">COMMAND CENTER</p>
          <h2 className="text-4xl font-black text-primary tracking-tight">{workspaceName}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleShare} className={whiteBtn}>
            <Share2 size={16} /> Share Link
          </button>
          {permissions.createTask && (
            <button onClick={() => setIsActionsOpen(true)} className={blackBtn}>
              <Plus size={16} /> New Action
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 shrink-0">
        {[
          { label: 'Total Tasks', value: total, bg: 'bg-white border-border', icon: <Kanban size={20} className="text-primary" /> },
          { label: 'Completed', value: done, bg: 'bg-primary text-white border-black', icon: <CheckCircle2 size={20} /> },
          { label: 'In Progress', value: inProgress, bg: 'bg-white border-border', icon: <PlayCircle size={20} className="text-primary" /> },
          { label: 'Overdue', value: overdue, bg: 'bg-white border-border', icon: <AlertCircle size={20} className="text-red-600" /> },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-2xl border flex items-center gap-4 shadow-sm hover:shadow-md transition-all ${s.bg}`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg.includes('bg-primary') ? 'bg-white/10' : 'bg-surface-alt'} flex items-center justify-center`}>{s.icon}</div>
            <div>
              <p className={`text-2xl font-black tracking-tighter ${s.bg.includes('text-white') ? 'text-white' : 'text-primary'}`}>{s.value}</p>
              <p className={`text-xs font-black uppercase tracking-widest ${s.bg.includes('text-white') ? 'text-gray-300' : 'text-gray-800'}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 items-stretch overflow-visible lg:overflow-hidden">
        {/* Team Members */}
        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col min-h-[400px] lg:min-h-0 shadow-sm hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2"><Users size={20} /> Team</h3>
            <span className="text-xs font-black bg-surface-alt border border-border text-primary px-3 py-1 rounded-full uppercase tracking-widest">{members.length} Units</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {members.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface-alt hover:bg-white border border-transparent hover:border-border rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-xs font-black text-primary group-hover:border-primary transition-all">{(m.email || 'U').substring(0, 2).toUpperCase()}</div>
                  <div>
                    <p className="text-xs font-black text-primary truncate max-w-[100px] uppercase group-hover:translate-x-1 transition-transform">{m.email}</p>
                    <p className="text-xs text-gray-800 font-black uppercase tracking-widest mt-1">EST. {new Date(m.joined_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs uppercase font-black tracking-[0.2em] px-2.5 py-1 rounded-lg bg-white border border-border text-primary group-hover:shadow-md transition-all">{m.role_name || 'MBR'}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/team')} disabled={!permissions.inviteMember} className={blackBtn + " w-full mt-4 disabled:opacity-30"}>
            Manage Personnel
          </button>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col min-h-[400px] lg:min-h-0 shadow-sm hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2"><CheckCircle2 size={20} /> Progress</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4 bg-surface-alt rounded-3xl mb-4 relative overflow-hidden group">
            <div className="relative w-36 h-36 group-hover:scale-110 transition-transform duration-500">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${progress} ${100 - progress}`} strokeLinecap="round" className="text-primary transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-primary tracking-tighter">{progress}%</p>
                <p className="text-xs text-gray-800 font-black uppercase tracking-[0.3em] mt-1">DONE</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-surface-alt border border-transparent hover:border-border p-3 rounded-xl text-center transition-all cursor-default"><p className="text-xs text-gray-800 font-black uppercase tracking-widest">Tasks</p><p className="text-xl font-black text-primary">{total}</p></div>
            <div className="bg-primary text-white border border-black p-3 rounded-xl text-center shadow-md hover:bg-white hover:text-black transition-all cursor-default"><p className="text-xs text-gray-300 font-black uppercase tracking-widest group-hover:text-gray-800">Done</p><p className="text-xl font-black text-white group-hover:text-primary">{done}</p></div>
            <div className="bg-surface-alt border border-transparent hover:border-border p-3 rounded-xl text-center transition-all cursor-default"><p className="text-xs text-gray-800 font-black uppercase tracking-widest">Active</p><p className="text-xl font-black text-primary">{inProgress}</p></div>
            <div className="bg-surface-alt border border-transparent hover:border-border p-3 rounded-xl text-center transition-all cursor-default"><p className="text-xs text-gray-800 font-black uppercase tracking-widest">Late</p><p className="text-xl font-black text-red-500">{overdue}</p></div>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col min-h-[400px] lg:min-h-0 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2"><PlayCircle size={20} /> Activity</h3>
            <span className="text-xs font-black tracking-widest text-white bg-red-500 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse tracking-widest">LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 relative custom-scrollbar min-h-0">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
            <div className="space-y-4">
              {activities.length > 0 ? activities.slice(0, 15).map((act, i) => (
                <div key={i} className="flex gap-4 relative z-10 group">
                  <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center shrink-0 mt-0.5 group-hover:border-primary transition-colors z-20 shadow-sm"><div className="w-1.5 h-1.5 bg-gray-300 group-hover:bg-primary rounded-full transition-colors"></div></div>
                  <div className="bg-white border border-border p-3 rounded-xl hover:shadow-md hover:border-black transition-all w-full">
                    <p className="text-sm leading-relaxed uppercase group-hover:translate-x-1 transition-transform"><span className="font-black text-primary">{act.actor_email || 'USER'}</span> <span className="text-gray-800 font-bold italic">{act.action_type.replace(/_/g, ' ').toLowerCase()}</span> <span className="font-black text-primary">{act.entity_type}</span></p>
                    <p className="text-xs text-gray-800 font-black mt-1 uppercase tracking-widest">{new Date(act.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-800 text-center mt-10 font-black uppercase tracking-[0.2em]">Log Clear</p>}
            </div>
          </div>
          <button onClick={() => navigate('/activity')} className={blackBtn + " w-full mt-4"}>
            View Sequence
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { path: '/tasks', label: 'TASK BOARD', icon: <Layout size={20} /> },
            { path: '/team', label: 'TEAM NETWORK', icon: <Users size={20} /> },
            { path: '/chat', label: 'DISCUSSION', icon: <MessageSquare size={20} /> },
            { path: '/activity', label: 'AUDIT LOG', icon: <Clock size={20} /> }
          ].map((link, idx) => (
            <div key={idx} onClick={() => navigate(link.path)} className="bg-surface-alt p-4 rounded-xl border border-transparent hover:border-border hover:bg-white cursor-pointer transition-all hover:shadow-md group flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-sm">{link.icon}</div>
              <p className="text-xs font-black text-primary tracking-widest uppercase group-hover:translate-x-1 transition-transform">{link.label}</p>
            </div>
          ))}
        </div>
      </div>
      <QuickActionsModal isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)} />
    </div>
  );
};

export default WorkspaceDashboard;
