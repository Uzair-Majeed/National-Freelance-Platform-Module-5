import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreHorizontal, Kanban } from 'lucide-react';
import { taskApi, workspaceApi } from '../api';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const wsData = await workspaceApi.getByProject('123e4567-e89b-12d3-a456-426614174000');
        if (wsData.success && wsData.data.length > 0) {
          const workspaceId = wsData.data[0].workspace_id;
          const tData = await taskApi.getByWorkspace(workspaceId);
          if (tData.success) {
            setTasks(tData.data);
          }
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-primary text-white';
      case 'MEDIUM': return 'bg-gray-200 text-gray-800';
      case 'LOW': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Organise tasks into columns
  const columns = [
    { title: 'TO DO', status: 'TODO', tasks: tasks.filter(t => t.status === 'TODO') },
    { title: 'IN PROGRESS', status: 'IN_PROGRESS', tasks: tasks.filter(t => t.status === 'IN_PROGRESS') },
    { title: 'UNDER REVIEW', status: 'UNDER_REVIEW', tasks: tasks.filter(t => t.status === 'UNDER_REVIEW') },
    { title: 'COMPLETED', status: 'DONE', tasks: tasks.filter(t => t.status === 'DONE') }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard &gt; Task Board</p>
          <h2 className="text-2xl font-semibold text-primary">Task Board — Apollo Brand Redesign</h2>
          <p className="text-sm text-gray-500 mt-1">Kanban view &middot; Last updated 14 Jun 2025</p>
        </div>
        <Link to="/tasks/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 shadow-sm transition-all">
          <Plus size={16} /> Create Task
        </Link>
      </div>

      <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 w-full max-w-2xl">
          <span className="font-bold text-sm whitespace-nowrap text-primary">
            {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}% Complete 
            <span className="text-gray-400 font-medium"> — {tasks.filter(t => t.status === 'DONE').length} of {tasks.length} tasks done</span>
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wide">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300"></span> To Do: {tasks.filter(t => t.status === 'TODO').length}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> In Progress: {tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> In Review: {tasks.filter(t => t.status === 'UNDER_REVIEW').length}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Completed: {tasks.filter(t => t.status === 'DONE').length}</span>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-stretch">
        {columns.map((col, index) => (
          <div key={index} className="flex-shrink-0 w-80 flex flex-col bg-gray-50 rounded-xl p-3 border border-border">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-gray-400' : index === 1 ? 'bg-blue-400' : index === 2 ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
                {col.title}
              </h3>
              <span className="text-xs bg-white border border-gray-200 text-primary px-2 py-0.5 rounded-lg font-bold shadow-sm">{col.tasks.length}</span>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto flex-1 pb-2 max-h-[calc(100vh-22rem)]">
              {col.tasks.map((task, tIdx) => (
                <Link to={`/tasks/${task.task_id}`} key={task.task_id} className="bg-surface p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[130px]">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <button className="text-gray-400 hover:text-primary transition-colors"><MoreHorizontal size={16} /></button>
                    </div>
                    <h4 className="text-sm font-bold text-primary mb-4 leading-snug tracking-tight">{task.title}</h4>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <img src={`https://ui-avatars.com/api/?name=${task.assigned_to || 'U'}&background=random`} alt="User" className="w-6 h-6 rounded-full shadow-sm border border-white" />
                      <span className="text-xs font-semibold text-gray-600">User {task.assigned_to ? task.assigned_to.slice(0,4) : 'Unassigned'}</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">{new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
              <button className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 py-2.5 px-1 bg-white border border-dashed border-gray-300 hover:border-primary hover:text-primary rounded-xl transition-all mt-2 shadow-sm">
                <Plus size={14} /> Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
