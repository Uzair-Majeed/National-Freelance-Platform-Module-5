import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

const TaskBoard = () => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-primary text-white';
      case 'MEDIUM': return 'bg-gray-200 text-gray-800';
      case 'LOW': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const columns = [
    {
      title: 'TO DO',
      count: 7,
      tasks: [
        { title: 'Define brand guidelines & visual identity', priority: 'HIGH', date: 'Jun 18', user: 'Mark R.' },
        { title: 'Competitive landscape research & audit', priority: 'MEDIUM', date: 'Jun 22', user: 'Lisa K.' },
        { title: 'Prepare client onboarding documentation', priority: 'LOW', date: 'Jun 28', user: 'Tom W.' }
      ]
    },
    {
      title: 'IN PROGRESS',
      count: 3,
      tasks: [
        { title: 'Typography system & colour palette design', priority: 'HIGH', date: 'Jul 12', user: 'Sarah M.' },
        { title: 'Wireframe homepage layout — desktop & mobile', priority: 'MEDIUM', date: 'Jun 20', user: 'Dan O.' },
        { title: 'Logo concepts — 3 initial directions', priority: 'HIGH', date: 'Jun 24', user: 'Nina P.' }
      ]
    },
    {
      title: 'UNDER REVIEW',
      count: 3,
      tasks: [
        { title: 'Brand strategy presentation — v2', priority: 'HIGH', date: 'Jun 15', user: 'Chris D.' },
        { title: 'Icon set & illustration style guide', priority: 'MEDIUM', date: 'Jul 10', user: 'Amy T.' },
        { title: 'Motion design principles & animation tokens', priority: 'LOW', date: 'Jun 19', user: 'Paul B.' }
      ]
    },
    {
      title: 'COMPLETED',
      count: 17,
      tasks: [
        { title: 'Initial project kickoff & scope definition', priority: 'HIGH', date: 'Jun 01', user: 'Sarah M.' },
        { title: 'Stakeholder interviews & user research', priority: 'MEDIUM', date: 'Jun 05', user: 'Alex P.' },
        { title: 'Moodboard & reference collection approved', priority: 'HIGH', date: 'Jun 08', user: 'Nina P.' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard &gt; Task Board</p>
          <h2 className="text-2xl font-semibold text-primary">Task Board — Apollo Brand Redesign</h2>
          <p className="text-sm text-gray-500 mt-1">Kanban view &middot; Last updated 14 Jun 2026</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-opacity-90">
          <Plus size={16} /> Create Task
        </button>
      </div>

      <div className="bg-surface p-4 rounded-xl shadow-sm border border-border mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <span className="font-semibold text-sm whitespace-nowrap">68% Complete <span className="text-gray-400 font-normal">— 17 of 25 tasks done</span></span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[68%] rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300"></span> To Do: 7</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> In Progress: 3</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> In Review: 3</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Completed: 17</span>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
        {columns.map((col, index) => (
          <div key={index} className="flex-shrink-0 w-80 flex flex-col bg-gray-50 rounded-xl p-3 border border-border h-full">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-gray-400' : index === 1 ? 'bg-blue-400' : index === 2 ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
                {col.title}
              </h3>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">{col.count}</span>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto flex-1 pb-2">
              {col.tasks.map((task, tIdx) => (
                <div key={tIdx} className="bg-white p-4 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                  </div>
                  <h4 className="text-sm font-semibold mb-4 leading-snug">{task.title}</h4>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2">
                       <img src={`https://ui-avatars.com/api/?name=${task.user}&background=random`} alt={task.user} className="w-6 h-6 rounded-full" />
                       <span className="text-xs font-medium text-gray-600">{task.user}</span>
                    </div>
                    <span className="text-xs text-gray-400">{task.date}</span>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 text-sm text-gray-500 font-medium py-2 px-1 hover:text-primary mt-2">
                <Plus size={16} /> Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
