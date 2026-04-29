import React from 'react';

const WorkspaceLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="bg-primary text-white h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button className="text-white hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <h1 className="text-xl font-bold tracking-wide">HOME</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium cursor-pointer hover:underline">FAQ</span>
          <span className="text-sm font-medium cursor-pointer hover:underline">Settings</span>
          <div className="w-8 h-8 rounded-full bg-gray-500 cursor-pointer overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Profile&background=random" alt="Profile" />
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:px-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default WorkspaceLayout;
