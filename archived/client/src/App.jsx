import React, { useState } from 'react';
import WorkspaceLayout from './modules/workspace/WorkspaceLayout';
import WorkspaceDashboard from './modules/workspace/WorkspaceDashboard';
import TeamManagement from './modules/workspace/TeamManagement';
import TaskBoard from './modules/workspace/TaskBoard';
import InviteMember from './modules/workspace/InviteMember';
import InvitationResponse from './modules/workspace/InvitationResponse';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <WorkspaceDashboard />;
      case 'team':
        return <TeamManagement />;
      case 'tasks':
        return <TaskBoard />;
      case 'invite':
        return <InviteMember />;
      case 'response':
        return <InvitationResponse />;
      default:
        return <WorkspaceDashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dev Navigation to switch between views since we don't have a real router setup yet */}
      <div className="bg-gray-800 text-white p-2 flex justify-center gap-4 text-sm font-medium z-50">
        <span className="opacity-50">Dev Menu:</span>
        <button onClick={() => setCurrentView('dashboard')} className={currentView === 'dashboard' ? 'text-blue-400' : 'hover:text-gray-300'}>Dashboard</button>
        <button onClick={() => setCurrentView('team')} className={currentView === 'team' ? 'text-blue-400' : 'hover:text-gray-300'}>Team Management</button>
        <button onClick={() => setCurrentView('tasks')} className={currentView === 'tasks' ? 'text-blue-400' : 'hover:text-gray-300'}>Task Board</button>
        <button onClick={() => setCurrentView('invite')} className={currentView === 'invite' ? 'text-blue-400' : 'hover:text-gray-300'}>Invite Modal</button>
        <button onClick={() => setCurrentView('response')} className={currentView === 'response' ? 'text-blue-400' : 'hover:text-gray-300'}>Invitation Response</button>
      </div>

      <WorkspaceLayout>
        {renderView()}
      </WorkspaceLayout>
    </div>
  );
}

export default App;
