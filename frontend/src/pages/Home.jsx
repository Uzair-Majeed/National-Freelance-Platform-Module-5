import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Users, Clock, ArrowRight, Folder, PlusCircle, X } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');

  const initialWorkspaces = [
    {
      id: 1,
      name: 'Apollo Brand Redesign',
      description: 'Strategic branding audit, visual guidelines execution, and core infrastructure modernization workflows.',
      tasksDone: 17,
      totalTasks: 25,
      members: ['Sarah M.', 'Alex R.', 'Marcus J.', 'Dan C.'],
      updatedAt: '2 hours ago',
      tag: 'Design'
    },
    {
      id: 2,
      name: 'Zenith Mobile App',
      description: 'Cross-platform e-commerce implementation utilizing React Native and advanced payment gateways.',
      tasksDone: 5,
      totalTasks: 12,
      members: ['Sarah M.', 'Dan C.', 'Nina P.'],
      updatedAt: '1 day ago',
      tag: 'Development'
    },
    {
      id: 3,
      name: 'Orion CRM Integration',
      description: 'Connecting legacy database architectures into modern client portal management rails.',
      tasksDone: 8,
      totalTasks: 8,
      members: ['Alex R.', 'Paul G.', 'Marcus J.'],
      updatedAt: '3 days ago',
      tag: 'Infrastructure'
    }
  ];

  const [workspaces, setWorkspaces] = useState(initialWorkspaces);

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const created = {
      id: workspaces.length + 1,
      name: newWorkspaceName,
      description: newWorkspaceDesc || 'Standard corporate workflow space.',
      tasksDone: 0,
      totalTasks: 0,
      members: ['Alex R.'],
      updatedAt: 'Just now',
      tag: 'General'
    };

    setWorkspaces([created, ...workspaces]);
    setNewWorkspaceName('');
    setNewWorkspaceDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-primary font-sans">
      {/* Top Bar */}
      <header className="bg-white border-b border-border h-16 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
            W
          </div>
          <span className="text-base font-extrabold tracking-wider uppercase text-primary">Workspace Gateway</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm transition-all"
          >
            <Plus size={16} /> Create Workspace
          </button>
          <div className="w-9 h-9 rounded-full bg-gray-200 border border-border flex items-center justify-center font-bold text-sm shadow-inner">
            JD
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-10 flex flex-col gap-8">
        
        {/* Welcome text */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Welcome Back, James</h1>
          <p className="text-sm text-gray-500 mt-1.5">Select your active operational domain or launch a new workflow.</p>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Workspace Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary hover:bg-primary/5 transition-all group min-h-[240px] shadow-sm"
          >
            <div className="w-12 h-12 bg-gray-50 group-hover:bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary border shadow-sm transition-all">
              <PlusCircle size={24} />
            </div>
            <div>
              <p className="font-bold text-sm text-primary group-hover:text-primary">Create Workspace</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Provision clean asset boundaries</p>
            </div>
          </button>

          {/* Actual Workspaces */}
          {workspaces.map((workspace) => {
            const progress = workspace.totalTasks > 0 
              ? Math.round((workspace.tasksDone / workspace.totalTasks) * 100) 
              : 0;

            return (
              <div 
                key={workspace.id}
                className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:border-primary/50 transition-all duration-250 group min-h-[240px] shadow-sm"
              >
                <div>
                  {/* Workspace Tag & Updated */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-extrabold tracking-widest uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded border shadow-sm">
                      {workspace.tag}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <Clock size={12}/> {workspace.updatedAt}
                    </span>
                  </div>

                  {/* Workspace Title */}
                  <h3 className="text-lg font-bold text-primary leading-snug group-hover:text-primary transition-colors">
                    {workspace.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 font-medium">
                    {workspace.description}
                  </p>
                </div>

                {/* Bottom Progress and Avatars */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold text-primary">
                    <span>{progress}% Complete</span>
                    <span className="text-gray-400 font-semibold">{workspace.tasksDone}/{workspace.totalTasks} Tasks</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-primary rounded-full shadow-sm transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    {/* Avatar Group */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {workspace.members.map((member, mIdx) => (
                        <img 
                          key={mIdx}
                          src={`https://ui-avatars.com/api/?name=${member}&background=random`} 
                          alt={member} 
                          className="w-6 h-6 rounded-full border-2 border-surface shadow-sm"
                        />
                      ))}
                    </div>

                    {/* Go to workspace button */}
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:gap-2.5 transition-all bg-gray-50 group-hover:bg-primary group-hover:text-white px-3 py-1.5 rounded-lg border border-gray-200 group-hover:border-primary shadow-sm"
                    >
                      Enter <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-md w-full p-6 animate-slide-up flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Folder size={20}/> Provision Workspace
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-primary transition-colors bg-gray-50 border p-1 rounded-lg"
              >
                <X size={18}/>
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Workspace Name</label>
                <input 
                  type="text"
                  required
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g., Titan Infrastructure Phase II"
                  className="border border-gray-300 rounded-lg p-2.5 text-sm font-bold focus:outline-none focus:border-primary shadow-inner w-full text-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Purpose / Description (Optional)</label>
                <textarea 
                  rows={3}
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="Define scope matrices..."
                  className="border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-primary shadow-inner w-full text-primary leading-relaxed"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-border mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 bg-white border border-gray-300 text-primary rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm transition-all flex items-center gap-2"
                >
                  Initialize Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
