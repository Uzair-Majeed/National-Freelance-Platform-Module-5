import React, { useState } from 'react';
import { User, ChevronDown, Check, LogOut } from 'lucide-react';

const MOCK_USERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'uzairmjd886@gmail.com',
    name: 'Uzair (Admin)',
    role: 'ADMIN'
  },
  {
    id: '25850b6a-dab9-418f-8e62-638fdf07b53b',
    email: 'i233063@isb.nu.edu.pk',
    name: 'Member 1',
    role: 'MEMBER'
  },
  {
    id: '6d5730ee-f2e7-4101-983b-e9f95fe0330e',
    email: 'narrator886@gmail.com',
    name: 'Member 2',
    role: 'MEMBER'
  }
];

const UserSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const activeUserId = localStorage.getItem('activeUserId') || MOCK_USERS[0].id;
  const activeUser = MOCK_USERS.find(u => u.id === activeUserId) || MOCK_USERS[0];

  const handleSwitch = (userId) => {
    localStorage.setItem('activeUserId', userId);
    setIsOpen(false);
    window.location.reload(); // Force reload to apply new identity across all state
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shadow-inner">
          {activeUser.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {activeUser.role} IDENTITY
          </p>
          <p className="text-xs font-bold leading-none">{activeUser.name}</p>
        </div>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 bg-gray-50 border-b border-border">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Active Identity</p>
              <p className="text-sm font-bold text-primary truncate">{activeUser.email}</p>
            </div>
            
            <div className="p-1">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSwitch(user.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeUserId === user.id 
                      ? 'bg-primary/5 text-primary font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      activeUserId === user.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <p className="leading-none">{user.name}</p>
                      <p className="text-[10px] font-medium opacity-60 mt-1">{user.role}</p>
                    </div>
                  </div>
                  {activeUserId === user.id && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>

            <div className="p-1 border-t border-border bg-gray-50/50">
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => {
                  localStorage.removeItem('activeUserId');
                  window.location.reload();
                }}
              >
                <LogOut size={14} /> Reset to Default (Admin)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserSwitcher;
