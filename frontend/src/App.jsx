import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WorkspaceLayout from './components/WorkspaceLayout';
import WorkspaceDashboard from './pages/WorkspaceDashboard';
import TeamManagement from './pages/TeamManagement';
import TaskBoard from './pages/TaskBoard';
import WorkspaceActivity from './pages/WorkspaceActivity';
import RolesAndPermissions from './pages/RolesAndPermissions';
import WorkspaceChat from './pages/WorkspaceChat';
import WorkspaceSettings from './pages/WorkspaceSettings';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import InvitationPage from './pages/InvitationPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invite" element={<InvitationPage />} />
        <Route path="/denied" element={<AccessDeniedPage />} />
        <Route path="/*" element={
          <WorkspaceLayout>
            <Routes>
              <Route path="/dashboard" element={<WorkspaceDashboard />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/tasks" element={<TaskBoard />} />
              <Route path="/tasks/new" element={<CreateTask />} />
              <Route path="/tasks/:taskId" element={<TaskDetail />} />
              <Route path="/activity" element={<WorkspaceActivity />} />
              <Route path="/roles" element={<RolesAndPermissions />} />
              <Route path="/chat" element={<WorkspaceChat />} />
              <Route path="/settings" element={<WorkspaceSettings />} />
            </Routes>
          </WorkspaceLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
