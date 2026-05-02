import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Kanban, Zap, ArrowRight, CheckCircle, Globe, Lock, Target } from 'lucide-react';
import FloatingLines from '../components/FloatingLines/FloatingLines';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-hidden relative font-sans">
      {/* High-Impact Black & White Background */}
      <div className="fixed inset-0 pointer-events-none opacity-100 z-0 bg-white">
        <FloatingLines 
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[20, 25, 30]}
          lineDistance={[10, 8, 6]}
          bendRadius={7.0}
          bendStrength={-1.0}
          interactive={true}
          parallax={true}
          linesGradient={['#000000', '#1a1a1a', '#333333']}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Full-Width Navigation Header */}
        <header className="w-full px-8 py-6 flex justify-between items-center border-b-2 border-black bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-xl shadow-2xl">
               <Globe size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none">National Freelance Platform</span>
              <span className="text-[10px] font-black text-black/50 uppercase tracking-[0.25em] mt-1">Professional Collaboration Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <button 
              onClick={() => navigate('/login')} 
              className="text-xs font-black uppercase tracking-[0.2em] hover:scale-110 transition-transform"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="px-10 py-3.5 bg-black text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black border-2 border-black transition-all shadow-2xl"
            >
              Signup
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <div className="bg-black text-white px-6 py-2 text-[11px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl">
             Workspace Optimization Active
          </div>
          
          <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] mb-12">
            Professional <br /> 
            Workspace & <br />
            Collaboration.
          </h1>
          
          <p className="text-xl text-black/70 max-w-2xl font-bold uppercase tracking-tight leading-relaxed mb-16">
            The authoritative collaborative infrastructure for the National Freelance Platform. 
            Unified project tracking and high-speed communication matrix.
          </p>

          <button 
            onClick={() => navigate('/login')}
            className="px-16 py-6 bg-black text-white text-xl font-black uppercase tracking-[0.2em] hover:invert transition-all shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-2 border-black"
          >
            Initialize Workspace
          </button>
        </div>

        {/* B&W Feature Grid */}
        <div className="w-full bg-white/90 border-t-2 border-black grid grid-cols-1 md:grid-cols-3">
          {[
            {
              title: "Strategic Security",
              desc: "Military-grade infrastructure protocols ensuring absolute data integrity.",
              icon: <Lock size={32} />
            },
            {
              title: "Operational Flow",
              desc: "Instant synchronization of personnel across all collaborative environments.",
              icon: <Target size={32} />
            },
            {
              title: "Unified Hub",
              desc: "Centralized command center for task management and team deliverables.",
              icon: <Kanban size={32} />
            }
          ].map((item, i) => (
            <div key={i} className={`p-16 flex flex-col items-start gap-8 border-black ${i !== 2 ? 'md:border-r-2' : ''} hover:bg-black hover:text-white transition-all duration-300 group`}>
               <div className="p-4 bg-black text-white group-hover:bg-white group-hover:text-black transition-all shadow-lg">
                  {item.icon}
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tighter">{item.title}</h3>
               <p className="text-sm font-bold uppercase tracking-tight leading-relaxed opacity-60 group-hover:opacity-100 transition-all">
                  {item.desc}
               </p>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
