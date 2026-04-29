import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckSquare, Calendar, User, Tag } from 'lucide-react';

const CreateTask = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignee: '',
    tag: 'Branding'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would hit an API endpoint
    navigate('/tasks');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary transition-all self-start bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        <ArrowLeft size={14}/> Back
      </button>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
          <CheckSquare size={20}/> Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Task Title</label>
            <input 
              type="text"
              required
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
              placeholder="e.g., Design new logo variants"
              className="border border-gray-300 rounded-lg p-2.5 text-sm font-bold focus:outline-none focus:border-primary shadow-inner w-full text-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea 
              rows={4}
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
              placeholder="Provide full details here..."
              className="border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-primary shadow-inner w-full text-primary leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                Priority
              </label>
              <select 
                value={taskData.priority}
                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                className="p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-primary focus:outline-none focus:border-primary cursor-pointer bg-white shadow-sm"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                Due Date
              </label>
              <input 
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                className="p-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:border-primary bg-white shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                Assignee
              </label>
              <select 
                value={taskData.assignee}
                onChange={(e) => setTaskData({...taskData, assignee: e.target.value})}
                className="p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-primary focus:outline-none focus:border-primary cursor-pointer bg-white shadow-sm"
              >
                <option value="">Unassigned</option>
                <option value="Sarah Mitchell">Sarah Mitchell</option>
                <option value="Marcus Reid">Marcus Reid</option>
                <option value="Mark R.">Mark R.</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                Tag
              </label>
              <input 
                type="text"
                value={taskData.tag}
                onChange={(e) => setTaskData({...taskData, tag: e.target.value})}
                placeholder="e.g., Branding"
                className="border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-primary shadow-inner text-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Attached Assets / Files</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50 flex flex-col items-center justify-center gap-2 text-center hover:border-primary transition-all cursor-pointer group shadow-inner">
              <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                <Save size={18} />
              </div>
              <p className="text-xs font-bold text-primary">Click to upload or drag and drop</p>
              <p className="text-[10px] font-medium text-gray-400">PDF, DOCX, PNG or JPG up to 50MB</p>
              <input type="file" className="hidden" />
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 pt-4 border-t border-border mt-6">
            <button 
              type="button"
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-white border border-gray-300 text-primary rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm flex items-center gap-2 transition-all"
            >
              <Save size={14}/> Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
