import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Toaster } from 'react-hot-toast';
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
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FileManagement from './pages/FileManagement';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('activeUserId');
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <WorkspaceProvider>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '10px',
              letterSpacing: '0.1em'
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '10px',
              letterSpacing: '0.1em'
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeSelector />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/invite" element={<InvitationPage />} />
          <Route path="/denied" element={<AccessDeniedPage />} />

          {/* Protected Internal Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
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
                  <Route path="/files" element={<FileManagement />} />
                  <Route path="/settings" element={<WorkspaceSettings />} />
                  {/* Fallback inside workspace */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </WorkspaceLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  );
}

const HomeSelector = () => {
  const isLoggedIn = !!localStorage.getItem('activeUserId');
  return isLoggedIn ? <Home /> : <LandingPage />;
};

export default App;
