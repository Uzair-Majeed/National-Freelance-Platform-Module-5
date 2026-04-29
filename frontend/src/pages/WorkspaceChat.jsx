import React, { useState } from 'react';
import { MessageSquare, Send, Smile, Paperclip } from 'lucide-react';

const WorkspaceChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alex Rivera', role: 'PROJECT OWNER', content: "Hey team, let's wrap up the sprint goals today.", time: '09:30 AM', isUser: false },
    { id: 2, user: 'Sarah Chen', role: 'Project Manager', content: "Sure, I'm almost done updating the board.", time: '09:32 AM', isUser: false },
    { id: 3, user: 'Marcus Johnson', role: 'Member', content: "Assets are uploaded. @Alex let me know if changes are needed.", time: '10:15 AM', isUser: false },
  ]);

  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      user: 'James Dawson',
      role: 'PROJECT OWNER',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] gap-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard &gt; Group Chat</p>
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <MessageSquare size={24}/> Team Workspace Chat
          </h2>
          <p className="text-sm text-gray-500 mt-1">Real-time collaboration and messaging for team members.</p>
        </div>
      </div>

      {/* Chat interface wrapper */}
      <div className="bg-surface rounded-xl shadow-sm border border-border flex flex-col flex-1 overflow-hidden">
        
        {/* Chat header inside interface */}
        <div className="p-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
              #
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">general-channel</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Workspace Discussion</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase italic">Read & write access</span>
        </div>

        {/* Chat body: Left messaging, Right members */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Column: Feed + Input */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Message Feed Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9FAFB]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 items-start ${msg.isUser ? 'flex-row-reverse text-right' : ''}`}>
                  <img src={`https://ui-avatars.com/api/?name=${msg.user}&background=random`} alt={msg.user} className="w-9 h-9 rounded-full shadow-inner border border-white" />
                  
                  <div className="flex flex-col gap-1 max-w-xl">
                    <div className={`flex items-center gap-2 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm font-bold text-primary">{msg.user}</span>
                      <span className={`text-[9px] font-extrabold tracking-widest px-1.5 py-0.5 rounded uppercase ${msg.isUser ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {msg.role}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{msg.time}</span>
                    </div>
                    
                    <div className={`p-3 rounded-xl shadow-sm border text-sm font-medium leading-relaxed ${
                      msg.isUser 
                        ? 'bg-primary text-white border-primary rounded-br-none' 
                        : 'bg-white text-primary border-gray-200 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-white flex items-center gap-3">
              <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-all">
                <Paperclip size={18} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message or tag teammates..." 
                className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:border-primary shadow-inner" 
              />
              <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-all">
                <Smile size={18} />
              </button>
              <button type="submit" className="p-2.5 bg-primary text-white rounded-lg hover:bg-opacity-90 shadow-sm transition-all">
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Right Column: Active Members */}
          <div className="w-64 bg-white border-l border-border hidden lg:flex flex-col">
            <div className="p-4 border-b border-border">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Workspace Members</h4>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {[
                { name: 'Alex Rivera', role: 'OWNER', active: true },
                { name: 'Sarah Chen', role: 'PM', active: true },
                { name: 'James Dawson', role: 'YOU', active: true },
                { name: 'Marcus Johnson', role: 'MEMBER', active: false },
                { name: 'Elena Rostova', role: 'MEMBER', active: false }
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-8 h-8 rounded-full shadow-sm border border-white" />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${member.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{member.name}</p>
                      <span className="text-[8px] font-extrabold tracking-widest text-gray-400 uppercase">{member.role}</span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${member.active ? 'text-green-600' : 'text-gray-400'}`}>
                    {member.active ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChat;
