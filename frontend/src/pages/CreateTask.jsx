import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckSquare, Paperclip, Activity, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { taskApi, workspaceApi, fileApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

const CreateTask = () => {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const [loading, setLoading]   = useState(false);
  const [members, setMembers]   = useState([]);
  const [attachedFile, setAttachedFile] = useState(null);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    deadline: '',
    assignedTo: '',
  });

  useEffect(() => {
    if (!workspaceId) { navigate('/'); return; }
    workspaceApi.getMembers(workspaceId).then(res => {
      if (res.success) setMembers(res.data);
    }).catch(console.error);
  }, [workspaceId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workspaceId) { toast.error('No workspace selected'); return; }
    try {
      setLoading(true);
      const res = await taskApi.create({
        workspaceId,
        title:       taskData.title,
        description: taskData.description,
        priority:    taskData.priority,
        deadline:    taskData.deadline || null,
        assignedTo:  taskData.assignedTo || null,
      });

      if (res.success && attachedFile) {
        const formData = new FormData();
        formData.append('file', attachedFile);
        formData.append('workspaceId', workspaceId);
        formData.append('taskId', res.data.id);
        await fileApi.upload(formData);
      }

      if (res.success) {
        toast.success('Task created successfully');
        navigate('/tasks');
      }
    } catch (err) {
      toast.error('Failed to create task: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: taskData[key],
    onChange: (e) => setTaskData({ ...taskData, [key]: e.target.value }),
  });

  const btnClass = "flex items-center justify-center gap-2 px-6 py-3 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95";

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <button onClick={() => navigate(-1)} className={btnClass + " self-start"}>
        <ArrowLeft size={16} /> Abort Operation
      </button>

      <div className="bg-white rounded-3xl border border-border shadow-xl p-10 flex flex-col max-w-4xl mx-auto w-full transition-all hover:shadow-2xl">
        <div className="flex items-center justify-between mb-10 border-b border-border pb-8">
            <h2 className="text-3xl font-black text-primary flex items-center gap-4 uppercase tracking-tighter">
                <CheckSquare size={32} /> Initialize New Task
            </h2>
            <div className="bg-black text-white p-2 rounded-lg shadow-lg">
                <Zap size={20} />
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Title */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] ml-1">DESIGNATION / TASK TITLE *</label>
            <input
              type="text" required
              {...field('title')}
              placeholder="E.G., DEPLOY INFRASTRUCTURE NODE"
              className="border border-border rounded-xl p-5 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-primary bg-gray-50 shadow-inner w-full text-primary placeholder-gray-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] ml-1">OPERATIONAL BRIEFING</label>
            <textarea
              rows={4}
              {...field('description')}
              placeholder="PROVIDE FULL ARCHITECTURAL DETAILS HERE..."
              className="border border-border rounded-xl p-5 text-sm font-bold focus:outline-none focus:border-primary bg-gray-50 shadow-inner w-full text-primary leading-relaxed uppercase tracking-wider placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Priority */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] ml-1">PRIORITY SEQUENCE</label>
              <select
                {...field('priority')}
                className="w-full p-4 border border-border rounded-xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary cursor-pointer bg-white shadow-sm hover:shadow-md transition-all"
              >
                <option value="HIGH">CRITICAL PRIORITY</option>
                <option value="MEDIUM">STANDARD PRIORITY</option>
                <option value="LOW">LOW PRIORITY</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] ml-1">TERMINATION DEADLINE</label>
              <input
                type="date"
                {...field('deadline')}
                className="p-4 border border-border rounded-xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary bg-white shadow-inner transition-all"
              />
            </div>
          </div>

          {/* Assignee & File Attachment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] ml-1">TARGET ASSIGNEE</label>
              <select
                {...field('assignedTo')}
                className="p-4 border border-border rounded-xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary cursor-pointer bg-white shadow-sm transition-all"
              >
                <option value="">UNASSIGNED UNIT</option>
                {members.map(m => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.email.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] ml-1">LINKED ASSET (OPTIONAL)</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setAttachedFile(e.target.files[0])}
                  className="w-full text-xs font-black uppercase tracking-widest text-gray-800 file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-none file:text-xs file:font-black file:uppercase file:tracking-[0.2em] file:bg-black file:text-white hover:file:bg-opacity-90 transition-all border border-border rounded-xl bg-gray-50 shadow-inner cursor-pointer"
                />
              </div>
              {attachedFile && (
                <div className="flex items-center gap-3 text-xs font-black text-primary bg-white px-4 py-2 rounded-lg border border-border shadow-sm mt-2">
                    <Activity size={12} className="animate-pulse" />
                    FILE STAGED: {attachedFile.name.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-10 border-t border-border mt-12">
            <button type="button" onClick={() => navigate(-1)} className={btnClass}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={btnClass}>
              <Save size={20} /> {loading ? 'SAVING…' : 'INITIALIZE TASK'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
