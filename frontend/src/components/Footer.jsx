import React from 'react';
import { Globe, Mail } from 'lucide-react';

const Footer = () => {
  const team = {
    developers: [
      { name: "Uzair Majeed", id: "23I-3063", email: "i233063@isb.nu.edu.pk" },
      { name: "Rizwan Saeed", id: "23I-3009", email: "i233009@isb.nu.edu.pk" }
    ],
    designers: [
      { name: "Maryam Farooq", id: "23I-3005", email: "i233005@isb.nu.edu.pk" },
      { name: "Zaki Haider", id: "23I-3091", email: "i233091@isb.nu.edu.pk" }
    ]
  };

  return (
    <footer className="w-full bg-black text-white px-8 pt-24 pb-12 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 border-b border-white/10 pb-20">
          {/* Branding */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-xl">
                <Globe size={28} />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">National Freelance <br />Platform</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 max-w-xs leading-relaxed">
              Collaborative infrastructure for high-performance freelance operations. Engineering excellence in teamwork.
            </p>
          </div>

          {/* Developers */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 border-b border-white/10 pb-4">Operational Development</h4>
            <div className="space-y-10">
              {team.developers.map(dev => (
                <div key={dev.id} className="group cursor-default">
                  <p className="text-base font-black uppercase tracking-widest group-hover:text-white/60 transition-colors">{dev.name}</p>
                  <p className="text-xs font-black text-white/50 uppercase tracking-widest mt-1">ID: {dev.id}</p>
                  <div className="flex items-center gap-3 text-sm font-black text-white/70 mt-3 lowercase">
                    <Mail size={16} /> {dev.email}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Designers */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 border-b border-white/10 pb-4">Strategic Design</h4>
            <div className="space-y-10">
              {team.designers.map(des => (
                <div key={des.id} className="group cursor-default">
                  <p className="text-base font-black uppercase tracking-widest group-hover:text-white/60 transition-colors">{des.name}</p>
                  <p className="text-xs font-black text-white/50 uppercase tracking-widest mt-1">ID: {des.id}</p>
                  <div className="flex items-center gap-3 text-sm font-black text-white/70 mt-3 lowercase">
                    <Mail size={16} /> {des.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final Bottom Line */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Professional Workspace Module v5.0</span>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em]">
            <span className="hover:text-white cursor-pointer transition-colors">Security Protocols</span>
            <span className="hover:text-white cursor-pointer transition-colors">Core Systems</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
