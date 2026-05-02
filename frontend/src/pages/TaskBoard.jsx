import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, Kanban } from 'lucide-react';
import { taskApi, roleApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

import LoadingSpinner from '../components/LoadingSpinner';

const PRIORITY_CARD_STYLES = {
  HIGH:   'bg-red-100/80 border-red-200 hover:bg-red-100',
  MEDIUM: 'bg-blue-100/80 border-blue-200 hover:bg-blue-100',
  LOW:    'bg-yellow-100/80 border-yellow-200 hover:bg-yellow-100',
};

const PRIORITY_BADGE_STYLES = {
  HIGH:   'bg-red-600 text-white',
  MEDIUM: 'bg-blue-600 text-white',
  LOW:    'bg-yellow-600 text-white',
};

const COLUMNS = [
  { title: 'TO DO',        status: 'TODO',         dot: 'bg-gray-600' },
  { title: 'IN PROGRESS',  status: 'IN_PROGRESS',  dot: 'bg-blue-600' },
  { title: 'UNDER REVIEW', status: 'UNDER_REVIEW', dot: 'bg-yellow-600' },
  { title: 'COMPLETED',    status: 'DONE',          dot: 'bg-green-600' },
];

const TaskBoard = () => {
  const navigate = useNavigate();
  const { workspaceId, workspaceName } = useWorkspace();
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    if (!workspaceId) { navigate('/'); return; }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskRes, permRes] = await Promise.all([
          taskApi.getByWorkspace(workspaceId),
          roleApi.checkPermission(workspaceId, 'CREATE_TASK')
        ]);
        if (taskRes.success) setTasks(taskRes.data);
        if (permRes.success) setCanCreate(permRes.data.allowed);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const done  = tasks.filter(t => t.status === 'DONE').length;
  const pct   = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  const btnClass = "flex items-center gap-2 px-6 py-3 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95";

  return (
    <div className="flex flex-col lg:h-[calc(100vh-7.5rem)] gap-6 overflow-y-auto lg:overflow-hidden pb-12 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <p className="text-sm text-gray-800 uppercase font-black tracking-[0.2em] mb-1">STRATEGIC FLOW</p>
          <h2 className="text-3xl font-black text-primary flex items-center gap-3">
            <Kanban size={28} /> {workspaceName} — Board
          </h2>
          <p className="text-xs font-black text-gray-800 uppercase tracking-widest mt-2">{tasks.length} ACTIVE OPERATIONAL UNITS</p>
        </div>
        {canCreate && (
          <Link to="/tasks/new" className={btnClass}>
            <Plus size={18} /> Initialize Task
          </Link>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-6 flex-1 w-full max-w-2xl">
          <span className="font-black text-xs uppercase tracking-widest whitespace-nowrap text-primary">
            {pct}% Efficiency <span className="text-gray-800 ml-2">— {done}/{tasks.length} RESOLVED</span>
          </span>
          <div className="flex-1 h-3 bg-surface-alt rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${pct}%` }}></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-800 font-black uppercase tracking-widest">
          {COLUMNS.map(c => (
            <span key={c.status} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`}></span>
              {c.title}: {tasks.filter(t => t.status === c.status).length}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-visible lg:overflow-hidden items-stretch">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.status);
          return (
            <div key={col.status} className="flex flex-col bg-surface-alt/50 border border-border rounded-2xl p-4 shadow-sm min-h-[400px] lg:min-h-0">
              <div className="flex justify-between items-center mb-6 px-1 shrink-0">
                <h3 className="font-black text-xs text-primary flex items-center gap-2 uppercase tracking-[0.2em]">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                  {col.title}
                </h3>
                <span className="text-xs bg-white border border-border text-primary px-2.5 py-1 rounded-lg shadow-sm font-black tracking-widest">{colTasks.length}</span>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {colTasks.map((task) => (
                  <Link
                    to={`/tasks/${task.task_id}`}
                    key={task.task_id}
                    className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[170px] group border-l-8 ${PRIORITY_CARD_STYLES[task.priority] || 'bg-white border-border'}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-black tracking-[0.2em] px-2 py-0.5 rounded uppercase shadow-sm ${PRIORITY_BADGE_STYLES[task.priority] || 'bg-gray-600 text-white'}`}>
                          {task.priority || 'MEDIUM'}
                        </span>
                        <button className="text-gray-400 hover:text-primary transition-colors" onClick={e => e.preventDefault()}>
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                      <h4 className="text-sm font-black text-primary mb-2 leading-tight uppercase tracking-tight group-hover:translate-x-1 transition-transform">{task.title}</h4>
                      {task.description && <p className="text-xs font-bold text-gray-800 line-clamp-2 uppercase tracking-wide leading-relaxed opacity-80">{task.description}</p>}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-black/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-xs font-black text-primary shadow-sm group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                          {(task.assignee_email || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest truncate max-w-[80px]">
                          {task.assignee_email || 'UNASSIGNED'}
                        </span>
                      </div>
                      {task.deadline && (
                        <span className="text-[10px] font-black tracking-widest text-gray-800 uppercase bg-white/40 px-1.5 py-0.5 rounded border border-black/5">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                {canCreate && (
                  <Link
                    to="/tasks/new"
                    className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-black text-white border border-black rounded-2xl transition-all mt-2 py-4 shadow-lg hover:bg-white hover:text-black shrink-0"
                  >
                    <Plus size={16} /> New Entry
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
