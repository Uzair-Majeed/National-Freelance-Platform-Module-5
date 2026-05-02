import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, CheckSquare, MessageSquare, Send, Loader2, AlertCircle, Paperclip, Download, Trash2, ShieldCheck, Activity, Edit3, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { taskApi, fileApi, activityApi, workspaceApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'DONE'];

const STATUS_STYLES = {
  TODO:         'bg-white text-primary border border-border',
  IN_PROGRESS:  'bg-blue-100 text-blue-700 border border-blue-200',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  DONE:         'bg-black text-white',
};

const PRIORITY_STYLES = {
  HIGH:   'bg-red-100 text-red-700 border border-red-200 shadow-sm',
  MEDIUM: 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm',
  LOW:    'bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm',
};

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate   = useNavigate();
  const { workspaceId } = useWorkspace();
  const activeUserId = localStorage.getItem('activeUserId');

  const [task, setTask]         = useState(null);
  const [members, setMembers]   = useState([]);
  const [files, setFiles]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: '', description: '', priority: '', deadline: '', assigned_to: '' });
  const [saving, setSaving] = useState(false);

  // Comment state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [postingComment, setPostingComment] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [taskRes, fileRes, activityRes] = await Promise.all([
        taskApi.getById(taskId),
        fileApi.getByTask(taskId),
        activityApi.getByEntity('TASK', taskId)
      ]);

      if (taskRes.success) {
        setTask(taskRes.data);
        setEditedTask({
          title: taskRes.data.title,
          description: taskRes.data.description,
          priority: taskRes.data.priority,
          deadline: taskRes.data.deadline ? taskRes.data.deadline.split('T')[0] : '',
          assigned_to: taskRes.data.assigned_to || ''
        });
        const memRes = await workspaceApi.getMembers(taskRes.data.workspace_id);
        if (memRes.success) setMembers(memRes.data);
      }
      
      if (fileRes.success) setFiles(fileRes.data);
      
      if (activityRes.success) {
        const commentLogs = activityRes.data.filter(log => log.action_type === 'COMMENT');
        setComments(commentLogs);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      const res = await taskApi.updateStatus(taskId, newStatus);
      if (res.success) {
        setTask(res.data);
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      }
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    try {
      setSaving(true);
      const res = await taskApi.update(taskId, {
        title: editedTask.title,
        description: editedTask.description,
        priority: editedTask.priority,
        deadline: editedTask.deadline || null,
        assigned_to: editedTask.assigned_to || null
      });
      if (res.success) {
        setTask(res.data);
        setIsEditing(false);
        toast.success('Task updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update task: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      setDeleting(true);
      await taskApi.delete(taskId);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch (err) {
      toast.error('Failed to delete task: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && !attachedFile) return;
    
    try {
      setPostingComment(true);
      let fileId = null;
      let fileName = null;

      if (attachedFile) {
        const formData = new FormData();
        formData.append('file', attachedFile);
        formData.append('workspaceId', workspaceId);
        formData.append('taskId', taskId);
        const fileRes = await fileApi.upload(formData);
        if (fileRes.success) {
          fileId = fileRes.data.file_id;
          fileName = fileRes.data.file_name;
        }
      }

      await taskApi.update(taskId, {
        _comment: newComment,
        _fileId: fileId,
        _fileName: fileName
      });

      setNewComment('');
      setAttachedFile(null);
      toast.success('Message posted');
      fetchData();
    } catch (err) {
      toast.error('Failed to post message: ' + err.message);
    } finally {
      setPostingComment(false);
    }
  };

  const getMemberEmail = (userId) => {
    if (!userId) return 'Unassigned';
    const member = members.find((m) => m.user_id === userId);
    return member ? member.email : `User ${userId.slice(0, 8)}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const isCreator = activeUserId === task?.created_by;

  const btnClass = "flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95";
  const redBtn   = "flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 text-white border border-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all shadow-lg active:scale-95";

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
        <div className="p-10 bg-white border border-border rounded-2xl shadow-xl">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-sm font-black text-primary uppercase tracking-widest">{error || 'Task context not found.'}</p>
            <button onClick={() => navigate(-1)} className={btnClass + " mt-6"}>Return to Board</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button onClick={() => navigate(-1)} className={btnClass + " w-full sm:w-auto"}>
          <ArrowLeft size={16} /> Return to Grid
        </button>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {isCreator && !isEditing && (
            <button onClick={() => setIsEditing(true)} className={btnClass + " w-full sm:w-auto"}>
              <Edit3 size={16} /> Edit Operational Unit
            </button>
          )}
          {isCreator && (
            <button onClick={handleDeleteTask} disabled={deleting} className={redBtn + " w-full sm:w-auto"}>
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Terminate Task
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-xl p-6 md:p-10 flex flex-col gap-10 transition-all hover:shadow-2xl">
        
        {/* Title & Priority Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4 w-full">
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-black text-gray-800 uppercase tracking-widest">DESIGNATION</label>
                   <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="w-full text-2xl font-black text-primary border border-border rounded-xl p-4 bg-gray-50 focus:outline-none focus:border-primary shadow-inner uppercase tracking-tight"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={editedTask.priority}
                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                    className="text-xs font-black tracking-widest border border-border rounded-xl px-4 py-2 uppercase bg-white cursor-pointer"
                  >
                    <option value="HIGH">HIGH PRIORITY</option>
                    <option value="MEDIUM">MEDIUM PRIORITY</option>
                    <option value="LOW">LOW PRIORITY</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <span className={`text-xs font-black tracking-[0.2em] px-4 py-1.5 rounded-lg uppercase ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM}`}>
                  {task.priority || 'MEDIUM'} PRIORITY UNIT
                </span>
                <h2 className="text-4xl font-black text-primary mt-6 leading-tight tracking-tighter uppercase group-hover:translate-x-1 transition-transform">
                  {task.title}
                </h2>
              </>
            )}
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusLoading}
              className={`w-full text-xs font-black tracking-widest border border-border rounded-xl px-6 py-4 cursor-pointer focus:outline-none transition-all uppercase shadow-lg ${STATUS_STYLES[task.status] || STATUS_STYLES.TODO}`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Edit Controls */}
        {isEditing && (
          <div className="flex justify-end gap-4 border-b border-border pb-8">
            <button onClick={() => setIsEditing(false)} className={btnClass}>
              <X size={16} /> Discard
            </button>
            <button onClick={handleUpdateTask} disabled={saving} className={btnClass}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              {saving ? 'COMMITTING...' : 'Commit Changes'}
            </button>
          </div>
        )}

        {/* Metadata Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50/50 rounded-2xl border border-border shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center text-primary group-hover:border-primary transition-all">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Assigned Unit</p>
              {isEditing ? (
                <select
                  value={editedTask.assigned_to}
                  onChange={(e) => setEditedTask({ ...editedTask, assigned_to: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-lg text-xs font-black uppercase tracking-widest focus:outline-none bg-white"
                >
                  <option value="">UNASSIGNED</option>
                  {members.map(m => (
                    <option key={m.user_id} value={m.user_id}>{m.email.toUpperCase()}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-black text-primary truncate max-w-[180px] uppercase">{getMemberEmail(task.assigned_to)}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center text-primary">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Deadline Frame</p>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.deadline}
                  onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-lg text-xs font-black uppercase tracking-widest focus:outline-none bg-white"
                />
              ) : (
                <p className="text-sm font-black text-primary uppercase">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'INDETERMINATE'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Operational Status</p>
              <p className="text-sm font-black text-primary uppercase">{task.status.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-black tracking-[0.3em] text-primary uppercase flex items-center gap-3 ml-1">
            <CheckSquare size={18} className="text-primary" /> Briefing Documentation
          </h4>
          {isEditing ? (
            <textarea
              rows={6}
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full text-sm font-bold text-primary/80 leading-relaxed bg-gray-50 shadow-inner border border-border rounded-2xl p-6 md:p-8 focus:outline-none focus:border-primary uppercase tracking-wide"
              placeholder="PROVIDE OPERATIONAL DETAILS..."
            />
          ) : (
            <div className="text-sm font-bold text-primary/80 leading-relaxed bg-gray-50/50 border border-border rounded-2xl p-6 md:p-8 shadow-inner min-h-[150px] uppercase tracking-wide">
              {task.description || <span className="text-gray-800 italic font-black">Null description provided.</span>}
            </div>
          )}
        </div>

        {/* Files Section */}
        <div className="space-y-6">
          <h4 className="text-sm font-black tracking-[0.3em] text-primary uppercase flex items-center gap-3 ml-1">
            <Paperclip size={18} className="text-primary" /> Integrated Assets ({files.length})
          </h4>
          <div className="flex flex-wrap gap-6">
            {files.length === 0 ? (
              <div className="w-full py-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-gray-800 gap-3 bg-gray-50/30">
                <Paperclip size={32} className="opacity-10" />
                <p className="text-xs font-black uppercase tracking-widest">No assets linked</p>
              </div>
            ) : (
              files.map(file => (
                <div key={file.file_id} className="flex items-center gap-5 bg-white border border-border rounded-2xl px-6 py-4 shadow-sm hover:shadow-xl transition-all group min-w-[240px] w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-border flex items-center justify-center text-primary group-hover:bg-black group-hover:text-white transition-all">
                    <Paperclip size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-primary uppercase truncate max-w-[150px]">{file.file_name}</p>
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest mt-0.5">{(file.file_size_bytes / 1024).toFixed(1)} KB</p>
                  </div>
                  <a 
                    href={fileApi.getDownloadUrl(file.file_id)} 
                    target="_blank" rel="noreferrer"
                    className="p-4 bg-black text-white rounded-xl shadow-md hover:bg-white hover:text-black border border-black transition-all"
                  >
                    <Download size={20} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comms Log */}
        <div className="border-t border-border pt-12 mt-4">
          <h4 className="text-sm font-black tracking-[0.3em] text-primary uppercase flex items-center gap-3 ml-1 mb-8">
            <MessageSquare size={18} className="text-primary" /> Comms Log ({comments.length})
          </h4>

          <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2 mb-10 custom-scrollbar">
            {comments.map((c) => {
              const data = c.new_value || {};
              return (
                <div key={c.log_id} className="flex gap-4 md:gap-6 items-start group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-xs font-black text-primary shadow-sm shrink-0">
                    {(c.actor_email || 'U').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-white border border-border p-5 md:p-6 rounded-2xl rounded-tl-none group-hover:shadow-lg transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-black text-primary uppercase tracking-widest">{c.actor_email}</span>
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] bg-gray-50 px-2 py-1 rounded border border-border">{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-bold text-primary/80 leading-relaxed uppercase tracking-wide">{data.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comment Form */}
          {!isEditing && (
            <form onSubmit={handleCommentSubmit} className="bg-gray-50/50 border border-border p-6 md:p-8 rounded-3xl shadow-inner">
              <div className="flex flex-col gap-6">
                <textarea
                  value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="TRANSMIT UPDATE..." rows={3}
                  className="w-full text-sm font-black text-primary bg-transparent focus:outline-none placeholder-gray-800 resize-none leading-relaxed uppercase tracking-wider"
                />
                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-border pt-6 gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <label className="p-4 bg-black text-white rounded-xl transition-all cursor-pointer shadow-lg hover:bg-white hover:text-black border border-black group">
                      <Paperclip size={24} />
                      <input type="file" className="hidden" onChange={(e) => setAttachedFile(e.target.files[0])} />
                    </label>
                    {attachedFile && (
                      <div className="flex items-center gap-3 text-xs font-black text-white bg-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest overflow-hidden truncate max-w-[200px]">
                        <Activity size={14} className="animate-pulse" />
                        {attachedFile.name.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={postingComment || (!newComment.trim() && !attachedFile)} className={btnClass + " w-full sm:w-auto"}>
                    {postingComment ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Transmit Message
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
