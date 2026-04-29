import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const WorkspaceLayout = ({ children }) => {
  const location = useLocation();
  const isSettings = location.pathname === '/settings';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        {!isSettings && <Sidebar />}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default WorkspaceLayout;
