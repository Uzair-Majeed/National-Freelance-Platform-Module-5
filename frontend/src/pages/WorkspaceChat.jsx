import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Smile, Paperclip, Loader2, Hash, FileText, Image as ImageIcon, Download, X, User, ShieldCheck, Mail, Maximize2, Reply, Trash2, Edit2, Check, CornerDownRight } from 'lucide-react';
import { chatApi, workspaceApi, fileApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';
import { toast } from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

// High Contrast colors for Light Mode
const getUserColor = (userId) => {
  const colors = [
    'text-blue-900 bg-blue-100 border-blue-300',
    'text-indigo-900 bg-indigo-100 border-indigo-300',
    'text-emerald-900 bg-emerald-100 border-emerald-300',
    'text-amber-900 bg-amber-100 border-amber-300',
    'text-rose-900 bg-rose-100 border-rose-300',
    'text-cyan-900 bg-cyan-100 border-cyan-300',
    'text-violet-900 bg-violet-100 border-violet-300',
  ];
  if (!userId) return colors[0];
  const index = String(userId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

import LoadingSpinner from '../components/LoadingSpinner';

const WorkspaceChat = () => {
  const { workspaceId, workspaceName } = useWorkspace();
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null); // New: state for editing
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeUserId = localStorage.getItem('activeUserId');

  const fetchData = async (showLoading = false) => {
    if (!workspaceId) return;
    try {
      if (showLoading) setLoading(true);
      const [historyRes, membersRes] = await Promise.all([
        chatApi.getHistory(workspaceId),
        workspaceApi.getMembers(workspaceId)
      ]);

      if (historyRes.success) setMessages(historyRes.data);
      if (membersRes.success) setMembers(membersRes.data);
    } catch (err) {
      console.error('Failed to fetch chat data:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 2000);
    return () => clearInterval(interval);
  }, [workspaceId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e, contentOverride = null, mediaId = null) => {
    if (e) e.preventDefault();
    const content = contentOverride !== null ? contentOverride : input;
    
    if (!content.trim() && !mediaId) return;
    if (sending) return;

    try {
      setSending(true);
      
      let res;
      if (editingMessage) {
        // Handle Edit
        res = await chatApi.editMessage(editingMessage.id, content.trim());
        if (res.success) {
          toast.success('Transmission Modified');
          setEditingMessage(null);
          setInput('');
        }
      } else {
        // Handle New Message / Reply
        res = await chatApi.sendMessage(workspaceId, content.trim(), mediaId, replyingTo?.id);
        if (res.success) {
          if (contentOverride === null) setInput('');
          setReplyingTo(null);
        }
      }

      if (res?.success) {
        const updatedHistory = await chatApi.getHistory(workspaceId);
        if (updatedHistory.success) setMessages(updatedHistory.data);
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Delete this transmission permanently?')) return;
    try {
      const res = await chatApi.deleteMessage(messageId);
      if (res.success) {
        toast.success('Transmission Terminated');
        fetchData(false);
      }
    } catch (err) {
      toast.error(`Delete Failed: ${err.message}`);
    }
  };

  const startEditing = (msg) => {
    setEditingMessage(msg);
    setReplyingTo(null);
    setInput(msg.content);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('workspaceId', workspaceId);
      formData.append('isChat', 'true');

      const res = await fileApi.upload(formData);
      if (res.success) {
        toast.success('Asset Shared');
        await handleSend(null, `Shared a file: ${file.name}`, res.data.id);
      }
    } catch (err) {
      toast.error(`Upload Failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] text-black">
      {/* Lightbox Modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200">
           <button 
             onClick={() => setExpandedImage(null)}
             className="absolute top-8 right-8 text-white hover:text-gray-300 transition-all p-2 bg-white/10 rounded-full"
           >
             <X size={32} />
           </button>
           <img 
             src={expandedImage} 
             alt="Expanded view" 
             className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-white/5"
           />
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shadow-lg border border-slate-800">
             <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-tighter leading-none">
              {workspaceName || 'General Discussion'}
            </h2>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mt-1">Operational Channel</p>
          </div>
        </div>
        <div className="text-[11px] font-black text-black uppercase tracking-widest bg-slate-200 px-4 py-2 rounded-lg border-2 border-slate-300">
           {members.length} Members Active
        </div>
      </div>

      {/* Interface Wrapper */}
      <div className="flex flex-1 overflow-hidden bg-white rounded-xl border-2 border-slate-300 shadow-md overflow-hidden">
        
        {/* Left: Feed and Input */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Feed Header */}
          <div className="px-6 py-4 border-b-2 border-slate-300 bg-slate-100 flex items-center gap-3">
             <Hash size={16} className="text-black" />
             <span className="text-[12px] font-black text-black uppercase tracking-widest">Workspace Frequency</span>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-emerald-100/20"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                 <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-3xl flex flex-col items-center text-emerald-900 shadow-sm">
                    <ShieldCheck size={56} className="mb-4 opacity-80" />
                    <p className="text-[12px] font-black uppercase tracking-[0.2em]">End-to-End Encryption Active</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60">Strategic channel is secure</p>
                 </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = String(msg.sender_id) === String(activeUserId);
                const isMedia = msg.message_type === 'media' || msg.media_id;
                const userTheme = getUserColor(msg.sender_id);
                const displayName = msg.sender_name?.split('@')[0] || 'User';
                const isImage = msg.mime_type?.startsWith('image/');
                const fileUrl = fileApi.getMediaUrl(msg.media_id);
                const isEdited = msg.is_edited;
                
                return (
                  <div key={msg.id || idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-400 shadow-sm`}>
                      <img 
                        src={`https://ui-avatars.com/api/?name=${displayName}&background=000&color=fff&bold=true`} 
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Bubble Container */}
                    <div className={`flex flex-col gap-1.5 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center gap-2.5 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[11px] font-black text-black uppercase tracking-tight">{displayName}</span>
                        <span className="text-[10px] font-black text-slate-500">{new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isEdited && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">(Edited)</span>}
                      </div>
                      
                      {msg.reply_to_msg_id && (
                        <div className={`mb-1 p-2 rounded-lg border-l-4 text-[10px] w-full bg-black/5 ${isMe ? 'border-white/50 text-white/70' : 'border-black/20 text-black/60'}`}>
                           <p className="font-black uppercase tracking-widest mb-0.5">Replying to {msg.reply_sender_name?.split('@')[0]}</p>
                           <p className="italic line-clamp-1">{msg.reply_content}</p>
                        </div>
                      )}

                      <div className={`relative group p-4 rounded-2xl border-2 shadow-sm text-[14px] font-black leading-relaxed transition-all ${
                        isMe 
                          ? 'bg-black text-white border-black rounded-tr-none' 
                          : `${userTheme} rounded-tl-none`
                      }`}>
                        {msg.content}

                        {/* Actions Overlay (Reply, Edit & Delete) */}
                        <div className={`absolute -top-3 ${isMe ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 z-10`}>
                           <button 
                             onClick={() => setReplyingTo(msg)}
                             className="bg-white border-2 border-slate-300 text-black p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95"
                             title="Reply"
                           >
                              <Reply size={14} />
                           </button>
                           {isMe && !isMedia && (
                             <button 
                               onClick={() => startEditing(msg)}
                               className="bg-white border-2 border-slate-300 text-black p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95"
                               title="Edit"
                             >
                                <Edit2 size={14} />
                             </button>
                           )}
                           {isMe && (
                             <button 
                               onClick={() => handleDelete(msg.id)}
                               className="bg-white border-2 border-red-200 text-red-600 p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95 hover:bg-red-50"
                               title="Delete"
                             >
                                <Trash2 size={14} />
                             </button>
                           )}
                        </div>

                        {isMedia && (
                          <div className="mt-4">
                            {isImage ? (
                              <div className="relative group/img cursor-pointer" onClick={() => setExpandedImage(fileUrl)}>
                                <img 
                                  src={fileUrl} 
                                  alt={msg.file_name} 
                                  className="rounded-xl border-2 border-slate-300 max-h-48 w-full object-cover shadow-sm group-hover/img:brightness-75 transition-all"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all">
                                   <div className="bg-black/50 p-2 rounded-full text-white">
                                      <Maximize2 size={24} />
                                   </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`p-3 rounded-xl border-2 flex items-center gap-4 ${
                                isMe ? 'bg-white/20 border-white/30' : 'bg-white/80 border-slate-400'
                              }`}>
                                <div className={`w-8 h-8 ${isMe ? 'bg-white/20' : 'bg-black/10'} rounded-lg flex items-center justify-center`}>
                                   <FileText size={18} />
                                </div>
                                <div className="flex-1 truncate">
                                  <p className="text-[11px] font-black uppercase truncate">{msg.file_name || 'Asset'}</p>
                                </div>
                                <a 
                                  href={fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-black/10 rounded-lg transition-all"
                                >
                                  <Download size={16} />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-2 border-slate-300 bg-white">
            {/* Replying To Indicator */}
            {replyingTo && (
              <div className="mb-2 p-2 bg-slate-100 border-l-4 border-black flex items-center justify-between rounded-r-lg">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                    <Reply size={12} /> Replying to {replyingTo.sender_name?.split('@')[0]}
                  </p>
                  <p className="text-xs text-slate-500 truncate italic">{replyingTo.content}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-slate-200 rounded-full transition-all">
                   <X size={16} />
                </button>
              </div>
            )}

            {/* Editing Indicator */}
            {editingMessage && (
              <div className="mb-2 p-2 bg-amber-50 border-l-4 border-amber-500 flex items-center justify-between rounded-r-lg animate-in slide-in-from-bottom-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 flex items-center gap-2">
                    <Edit2 size={12} /> Editing Strategic Transmission
                  </p>
                  <p className="text-xs text-amber-600 truncate italic">Original: {editingMessage.content}</p>
                </div>
                <button onClick={() => { setEditingMessage(null); setInput(''); }} className="p-1 hover:bg-amber-100 rounded-full transition-all text-amber-700">
                   <X size={16} />
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className={`relative bg-slate-100 rounded-xl border-2 transition-all shadow-inner ${editingMessage ? 'border-amber-400 focus-within:border-amber-600' : 'border-slate-400 focus-within:border-black'}`}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={editingMessage ? "Modify transmission..." : "Initiate transmission..."} 
                className="w-full bg-transparent p-4 pr-36 text-sm font-black text-black focus:outline-none placeholder:text-slate-500 placeholder:uppercase" 
              />
              
              <div className="absolute right-2 top-0 bottom-0 flex items-center gap-1">
                {!editingMessage && (
                  <>
                    <div className="relative">
                      <button 
                        type="button" 
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="p-2.5 text-slate-500 hover:text-black transition-all"
                      >
                        <Smile size={22} />
                      </button>
                      {showEmoji && (
                        <div className="absolute bottom-full mb-4 right-0 z-50 shadow-2xl border-2 border-slate-400 rounded-2xl overflow-hidden">
                          <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
                        </div>
                      )}
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="p-2.5 text-slate-500 hover:text-black transition-all"
                    >
                      {uploading ? <Loader2 size={22} className="animate-spin" /> : <Paperclip size={22} />}
                    </button>
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={(!input.trim() && !uploading) || sending}
                  className={`${editingMessage ? 'bg-amber-600' : 'bg-black'} text-white px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-[0.1em] hover:opacity-90 shadow-lg active:scale-95 transition-all flex items-center gap-2`}
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : (editingMessage ? <Check size={16} /> : <Send size={16} />)}
                  {editingMessage ? 'Update' : ''}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Workspace Members */}
        <div className="w-72 border-l-2 border-slate-300 bg-slate-100 flex flex-col">
          <div className="p-6 border-b-2 border-slate-300 bg-white">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black mb-1">Workspace Members</h4>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Personnel</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {members.map((member, index) => (
              <div key={index} className="flex items-center gap-4 group p-3 rounded-xl border-2 border-transparent hover:border-slate-400 hover:bg-white transition-all cursor-default">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-black text-white border-2 border-slate-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                     <User size={22} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-500 shadow-sm"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-black text-black uppercase tracking-tighter truncate">{member.display_name || member.email?.split('@')[0]}</p>
                  <p className="text-[10px] font-black text-slate-600 truncate flex items-center gap-1 lowercase mt-0.5">
                     <Mail size={12} className="shrink-0" /> {member.email}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t-2 border-slate-300 bg-white text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Core V1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChat;
