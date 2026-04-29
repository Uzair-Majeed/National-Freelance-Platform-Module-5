import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, CheckSquare, MessageSquare, Send, Paperclip } from 'lucide-react';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([
    { id: 1, actor: 'Sarah Mitchell', role: 'UI Designer', time: 'Yesterday, 11:30 AM', content: 'Uploaded typography assets.' },
    { id: 2, actor: 'Marcus Reid', role: 'Project Manager', time: 'Today, 09:15 AM', content: 'Looks optimal, confirming approvals.' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, {
      id: comments.length + 1,
      actor: 'James Dawson',
      role: 'PROJECT OWNER',
      time: 'Just now',
      content: newComment
    }]);
    setNewComment('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary transition-all self-start bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        <ArrowLeft size={14}/> Back to Board
      </button>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col gap-6">
        {/* Title & Priority */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest bg-primary text-white px-2.5 py-1 rounded shadow-sm uppercase select-none">
              High Priority
            </span>
            <h2 className="text-2xl font-bold text-primary mt-3 leading-snug tracking-tight">
              Typography system & colour palette design
            </h2>
          </div>
          <span className="text-[10px] font-extrabold tracking-widest bg-blue-50 border border-blue-200 text-blue-600 px-2 py-1 rounded shadow-sm">
            IN PROGRESS
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border shadow-sm flex items-center justify-center text-gray-400"><User size={16}/></div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Assignee</p>
              <p className="text-xs font-bold text-primary">Sarah Mitchell</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border shadow-sm flex items-center justify-center text-gray-400"><Calendar size={16}/></div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Due Date</p>
              <p className="text-xs font-bold text-primary">12 Jul 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border shadow-sm flex items-center justify-center text-gray-400"><Tag size={16}/></div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Tag</p>
              <p className="text-xs font-bold text-primary">Branding / UI</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-extrabold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 mb-2">
            <CheckSquare size={14}/> Task Description
          </h4>
          <div className="text-sm font-medium text-primary leading-relaxed bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            Establish foundational design tokens. Provide appropriate typography weights for marketing copy structures appropriately.
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h4 className="text-xs font-extrabold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 mb-4">
            <MessageSquare size={14}/> Comments ({comments.length})
          </h4>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 items-start bg-gray-50 p-3.5 rounded-xl border border-gray-200 shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=${c.actor}&background=random`} alt={c.actor} className="w-7 h-7 rounded-full shadow-inner border" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{c.actor}</span>
                    <span className="text-[8px] font-extrabold tracking-widest bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase">{c.role}</span>
                    <span className="text-[10px] font-medium text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 mt-1.5 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post a quick update..."
              className="flex-1 text-sm font-semibold text-primary bg-white border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-primary shadow-inner"
            />
            <button type="submit" className="bg-primary text-white p-3 rounded-lg shadow-sm hover:bg-opacity-90 transition-all">
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TaskDetail;
