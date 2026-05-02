import React from 'react';
import { Settings, HelpCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('activeUserEmail') || 'User';
  
  // Generate initials from email
  const initials = email
    .split('@')[0]
    .split(/[._-]/)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem('activeUserId');
    localStorage.removeItem('activeUserEmail');
    window.location.href = '/'; // Hard reload to clear all states
  };

  return (
    <header className="bg-primary text-white h-14 flex items-center justify-between px-6 sticky top-0 z-40 shadow-md">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-white border-2 border-white/20 flex items-center justify-center p-1.5 shadow-lg group-hover:scale-105 transition-all">
            <img src="/logo.png" alt="NFP Logo" className="w-full h-full object-contain invert" />
          </div>
          <span className="font-black text-[11px] tracking-[0.3em] uppercase text-white drop-shadow-md">National Freelance Platform</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black tracking-tighter border border-white/10 shadow-inner">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Verified Session</p>
            <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">{email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-300 hover:text-white transition-all flex items-center gap-2 group"
          title="Logout"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
