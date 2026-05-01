import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ShieldAlert, AlertTriangle, Save, HardDrive, Globe, ArrowLeft } from 'lucide-react';
import { workspaceApi } from '../api';

const WorkspaceSettings = () => {
  const navigate = useNavigate();
  const [workspaceId, setWorkspaceId] = useState('');
  const [wsName, setWsName] = useState('');
  const [wsDesc, setWsDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const generalRef = useRef(null);
  const memberRef = useRef(null);
  const storageRef = useRef(null);
  const securityRef = useRef(null);
  const dangerRef = useRef(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const wsData = await workspaceApi.getByProject('123e4567-e89b-12d3-a456-426614174000');
      if (wsData.success && wsData.data.length > 0) {
        const ws = wsData.data[0];
        setWorkspaceId(ws.workspace_id);
        setWsName(ws.name);
        setWsDesc('Strategic branding audit and core infrastructure modernisation.');
      }
    };
    fetchWorkspace();
  }, []);

  const handleSave = async () => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      await workspaceApi.update(workspaceId, { name: wsName });
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async () => {
    if (!workspaceId) return;
    if (!window.confirm('CRITICAL: This will permanently delete all data in this workspace. Are you absolutely sure?')) {
      return;
    }

    try {
      setLoading(true);
      await workspaceApi.delete(workspaceId);
      alert('Workspace purged successfully.');
      navigate('/');
    } catch (err) {
      console.error('Error purging workspace:', err);
      alert('Failed to purge workspace: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-7.5rem)] overflow-hidden">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary transition-all self-start bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        <ArrowLeft size={14}/> Back
      </button>

      <div className="flex gap-6 flex-1 overflow-hidden">
      
      {/* Internal Settings Left Rail */}
      <div className="w-56 shrink-0 flex flex-col border-r border-border pr-4 py-2">
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="w-7 h-7 bg-primary/5 text-primary flex items-center justify-center rounded-md">
            <Settings size={16}/>
          </div>
          <h3 className="text-sm font-bold text-primary tracking-wider uppercase">Settings</h3>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { label: 'General Details', icon: <Globe size={14}/>, ref: generalRef },
            { label: 'Member Defaults', icon: <ShieldAlert size={14}/>, ref: memberRef },
            { label: 'Storage & Limits', icon: <HardDrive size={14}/>, ref: storageRef },
            { label: 'Security Protocols', icon: <ShieldAlert size={14}/>, ref: securityRef },
            { label: 'Danger Zone', icon: <AlertTriangle size={14}/>, ref: dangerRef }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSection(item.ref)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-primary transition-all text-left"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Right Main Scroll Container */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-6 pb-12 max-h-full text-primary font-medium">
        
        {/* Section 1: General Details */}
        <div ref={generalRef} className="bg-surface rounded-xl border border-border p-6 shadow-sm scroll-mt-6 flex flex-col">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary flex items-center gap-2 mb-6">
            <Globe size={16}/> General Workspace Details
          </h4>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Workspace Name</label>
              <input 
                type="text" 
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 text-sm font-bold focus:outline-none focus:border-primary shadow-inner w-full text-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Workspace Purpose / Description</label>
              <textarea 
                rows={3}
                value={wsDesc}
                onChange={(e) => setWsDesc(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-primary shadow-inner w-full text-primary leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Member Defaults */}
        <div ref={memberRef} className="bg-surface rounded-xl border border-border p-6 shadow-sm scroll-mt-6 flex flex-col">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary flex items-center gap-2 mb-6">
            <ShieldAlert size={16}/> Member Defaults & Permissions
          </h4>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Default Role for New Members</label>
              <select className="p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-primary focus:outline-none focus:border-primary cursor-pointer bg-white shadow-sm w-full md:w-64">
                <option>Team Member</option>
                <option>Project Manager</option>
              </select>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3.5 shadow-inner">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"/>
              <div>
                <p className="text-xs font-bold text-primary">Allow Members to invite guests</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">External guests can view allocated sub-task matrices only.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Storage & Limits */}
        <div ref={storageRef} className="bg-surface rounded-xl border border-border p-6 shadow-sm scroll-mt-6 flex flex-col">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary flex items-center gap-2 mb-6">
            <HardDrive size={16}/> Storage Allocations
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm text-primary whitespace-nowrap">4.2 GB of 15 GB used</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-primary w-[28%] rounded-full shadow-sm"></div>
              </div>
            </div>
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-400">Maximum upload size cap per file: <span className="text-primary ml-1">100 MB</span></p>
          </div>
        </div>

        {/* Section 4: Security Protocols */}
        <div ref={securityRef} className="bg-surface rounded-xl border border-border p-6 shadow-sm scroll-mt-6 flex flex-col">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary flex items-center gap-2 mb-6">
            <ShieldAlert size={16}/> Workspace Security
          </h4>
          <div className="space-y-3 bg-gray-50/50 rounded-lg p-4 border border-gray-200 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-primary">Enforce 2FA</p>
                <p className="text-[10px] font-medium text-gray-400 mt-0.5">All members must utilize multi-factor authentication.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"/>
            </div>
          </div>
        </div>

        {/* Section 5: Danger Zone */}
        <div ref={dangerRef} className="bg-red-100 border border-red-300 p-6 rounded-xl shadow-md scroll-mt-6 flex flex-col">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-red-600 flex items-center gap-2 mb-6">
            <AlertTriangle size={16}/> Danger Zone
          </h4>
          <div className="p-4 border border-red-200 bg-white rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-primary">Delete this workspace</p>
              <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Permanently wipes activity, files, chats. Action irreversible.</p>
            </div>
            <button 
              onClick={handlePurge}
              disabled={loading}
              className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Purging...' : 'Purge Workspace'}
            </button>
          </div>
        </div>

        {/* Sticky controls at bottom */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-border">
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-gray-300 text-primary rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm transition-all"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save size={14}/> {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </div>
    </div>
  </div>
  );
};

export default WorkspaceSettings;
