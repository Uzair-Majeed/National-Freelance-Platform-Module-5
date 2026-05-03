import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Users, Clock, ArrowRight, Folder, PlusCircle, X, Globe, LogOut, Mail } from 'lucide-react';
import { workspaceApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

const PROJECT_IDS = [1, 2, 3, 4, 5];

const Home = () => {
  const navigate = useNavigate();
  const { setWorkspace } = useWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(1);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch workspaces for ALL integration projects
      const wsPromises = PROJECT_IDS.map(id => workspaceApi.getByProject(id));
      const wsResults = await Promise.all(wsPromises);
      const allWorkspaces = wsResults.filter(r => r.success).flatMap(r => r.data);
      setWorkspaces(allWorkspaces);

      // Fetch invitations for ME
      const invData = await workspaceApi.getMyInvitations();
      if (invData.success) {
        setInvitations(invData.data);
      }
    } catch (err) {
      setError('System Sync Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      setCreating(true);
      const result = await workspaceApi.create({ name: newWorkspaceName, projectId: activeProjectId });
      if (result.success) {
        setWorkspaces([result.data, ...workspaces]);
        setNewWorkspaceName('');
        setNewWorkspaceDesc('');
        setIsModalOpen(false);
        toast.success('Workspace Initialized');
      }
    } catch (err) {
      alert('Deployment Failure: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleEnter = (ws) => {
    setWorkspace(ws.id, ws.name);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('activeUserId');
    localStorage.removeItem('activeUserEmail');
    window.location.href = '/';
  };

  const email = localStorage.getItem('activeUserEmail') || 'User';
  const initials = email.split('@')[0].split(/[._-]/).map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-none"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">

      {/* Header Wrapper */}
      <header className="bg-white border-b-2 border-black px-8 py-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-xl shadow-xl">
             <Globe size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-tighter leading-none">Workspace and Collaboration</span>
            <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] mt-1.5">National Freelance Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-3.5 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:invert transition-all shadow-xl"
          >
            <Plus size={18} /> New Workspace
          </button>
          
          <div className="flex items-center gap-8 border-l-2 border-black/10 pl-10">
            <div className="flex items-center gap-5 text-right">
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] leading-none">Session Active</p>
                <p className="text-[12px] font-black text-black leading-tight mt-1.5">{email}</p>
              </div>
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-sm font-black rounded-full border-2 border-white shadow-xl">
                {initials}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-black text-white hover:invert transition-all rounded-xl"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Expanded */}
      <main className="flex-1 w-full px-8 md:px-24 py-24 flex flex-col gap-20 max-w-[1800px] mx-auto">

        <div className="text-center md:text-left">
          <h1 className="text-7xl font-black uppercase tracking-tighter text-black">Workspace Dashboard</h1>
          <p className="text-sm font-black text-black/40 uppercase tracking-[0.4em] mt-5">Create or start in a collaborative workspace setting</p>
          {error && (
            <div className="text-xs text-red-500 mt-6 font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500"></div> {error}
            </div>
          )}
        </div>

        {/* Invitations Section */}
        {invitations.length > 0 && (
          <div className="bg-black text-white p-12 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                <Mail size={32} /> Incoming Linkages
              </h2>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-2">External entities requesting collaboration</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {invitations.map(inv => (
                <div key={inv.id} className="bg-white/10 border border-white/20 p-6 flex flex-col gap-4 backdrop-blur-md hover:bg-white/20 transition-all group">
                   <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black rounded-lg">
                        <Users size={20} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-white/10">PENDING SYNC</span>
                   </div>
                   <div>
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Target Workspace</p>
                     <p className="text-sm font-black uppercase tracking-tight">{inv.workspace_name}</p>
                   </div>
                   <button 
                    onClick={() => navigate(`/invite?invitationId=${inv.id}`)}
                    className="w-full mt-4 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:invert transition-all flex items-center justify-center gap-2"
                   >
                     Respond to Invite <ArrowRight size={14} />
                   </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace Grid - More Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Create Card - Bigger */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white border-4 border-dashed border-black/10 p-12 flex flex-col items-center justify-center text-center gap-8 hover:border-black hover:bg-black/5 transition-all group min-h-[420px]"
          >
            <div className="w-24 h-24 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
              <PlusCircle size={48} />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-[0.3em] text-black">Create new Workspace</p>
              <p className="text-[11px] font-black text-black/30 uppercase tracking-widest mt-4">Start fresh or work in existing workspace</p>
            </div>
          </button>

          {/* Workspace Cards - Bigger & Bolder */}
          {workspaces.map((ws, idx) => (
            <div
              key={ws.id}
              className="bg-white border-4 border-black p-12 flex flex-col justify-between hover:shadow-[0_50px_100px_rgba(0,0,0,0.15)] transition-all duration-500 group min-h-[420px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-black/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[11px] font-black tracking-[0.3em] uppercase bg-black text-white px-5 py-2.5">
                    WP-{idx + 101}
                  </span>
                  <span className="text-[11px] font-black text-black/30 flex items-center gap-2 uppercase tracking-widest">
                    <Clock size={16} /> {new Date(ws.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-4xl font-black text-black uppercase tracking-tighter leading-tight group-hover:text-black transition-colors">{ws.name}</h3>
                <p className="text-[11px] font-black text-black/40 mt-8 uppercase tracking-[0.3em] leading-relaxed">
                   Active Production Workspace <br/> Secure Tunnel Enabled
                </p>
              </div>

              <div className="mt-12 pt-10 border-t-4 border-black/5 flex items-center justify-end relative z-10">
                <button
                  onClick={() => handleEnter(ws)}
                  className="flex items-center gap-4 text-[12px] font-black uppercase tracking-widest text-black border-4 border-black px-10 py-4 hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                >
                  Enter Command <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Massive Space before Footer */}
        <div className="h-48"></div>
      </main>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white border-[6px] border-black max-w-md w-full p-8 flex flex-col gap-6 shadow-[0_60px_120px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b-4 border-black pb-8">
              <h3 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-4">
                <Folder size={32} /> System Deploy
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-black/40 hover:text-black transition-colors">
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-black/80 uppercase tracking-[0.4em]">Integrated Project</label>
                <select
                  value={activeProjectId}
                  onChange={(e) => setActiveProjectId(parseInt(e.target.value))}
                  className="border-4 border-black p-4 text-sm font-black uppercase tracking-widest focus:outline-none w-full text-black bg-white cursor-pointer"
                >
                  {PROJECT_IDS.map(id => (
                    <option key={id} value={id}>PROJECT SEQUENCE #{id}</option>
                  ))}
                </select>
                <p className="text-[8px] font-black text-black/40 uppercase tracking-widest">Note: Each project supports exactly one workspace in the centralized schema.</p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-black/80 uppercase tracking-[0.4em]">Workspace Designation</label>
                <input
                  type="text"
                  required
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="IDENTIFIER"
                  className="border-4 border-black/20 focus:border-black p-4 text-sm font-black uppercase tracking-widest focus:outline-none w-full text-black placeholder-black/40"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-black/80 uppercase tracking-[0.4em]">Mission Parameters</label>
                <textarea
                  rows={2}
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="DESCRIPTION"
                  className="border-4 border-black/20 focus:border-black p-4 text-sm font-black uppercase tracking-widest focus:outline-none w-full text-black placeholder-black/40 leading-relaxed resize-none"
                />
              </div>
              <div className="flex justify-end items-center gap-6 pt-6 border-t-4 border-black/5 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60 hover:text-black transition-colors">
                  Abort
                </button>
                <button type="submit" disabled={creating} className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:invert transition-all disabled:opacity-50">
                  {creating ? 'Deploying…' : 'Initialize Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
