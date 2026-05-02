import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Kanban, ClipboardList, ShieldAlert, MessageSquare, Settings, LogOut, Folder } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { roleApi } from '../api';

const Sidebar = () => {
  const { workspaceId, workspaceName, clearWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [permissions, setPermissions] = React.useState({
    viewActivity: true,
    editSettings: true,
  });

  React.useEffect(() => {
    if (!workspaceId) return;
    const check = async () => {
      const [p1, p2] = await Promise.all([
        roleApi.checkPermission(workspaceId, 'VIEW_ACTIVITY_LOG'),
        roleApi.checkPermission(workspaceId, 'EDIT_WORKSPACE_SETTINGS')
      ]);
      setPermissions({
        viewActivity: p1.success ? p1.data.allowed : false,
        editSettings: p2.success ? p2.data.allowed : false,
      });
    };
    check();
  }, [workspaceId]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Team Management', path: '/team', icon: <Users size={18} /> },
    { name: 'Task Board', path: '/tasks', icon: <Kanban size={18} /> },
    { name: 'Activity Log', path: '/activity', icon: <ClipboardList size={18} />, hidden: !permissions.viewActivity },
    { name: 'Roles & Permissions', path: '/roles', icon: <ShieldAlert size={18} /> },
    { name: 'Group Chat', path: '/chat', icon: <MessageSquare size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  const handleExit = () => {
    clearWorkspace();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] z-30">
      <div className="p-4 border-b border-border">
        <div className="bg-gray-50 rounded-lg p-3 border border-border">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Workspace</p>
          <p className="text-sm font-bold text-primary truncate mt-0.5">
            {workspaceName || 'No workspace selected'}
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.filter(l => !l.hidden).map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
