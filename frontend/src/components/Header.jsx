import React from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-white h-14 flex items-center justify-between px-6 sticky top-0 z-40 shadow-md">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-wider uppercase">Freelance Platform</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-xs uppercase tracking-wider font-semibold text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/faq" className="text-xs uppercase tracking-wider font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1"><HelpCircle size={14}/> FAQ</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all">
          <Settings size={18} />
        </button>
        <div className="flex items-center gap-2 border-l border-white/20 pl-4">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-xs font-bold text-primary select-none cursor-pointer shadow-sm">
            PR
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
