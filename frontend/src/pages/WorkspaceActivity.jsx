import React, { useState, useEffect } from 'react';
import { ClipboardList, Filter, Calendar, User, Search, Download } from 'lucide-react';
import { activityApi } from '../api';

const WorkspaceActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would come from context or URL
  const WORKSPACE_ID = 'your-actual-workspace-id'; 

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // For demo, we'll fetch for the first workspace we find
        const response = await fetch('http://localhost:5000/api/workspaces/project/123e4567-e89b-12d3-a456-426614174000');
        const wsData = await response.json();
        
        if (wsData.success && wsData.data.length > 0) {
          const actData = await activityApi.getByWorkspace(wsData.data[0].workspace_id);
          if (actData.success) {
            setActivities(actData.data);
          }
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getTypeStyles = (type) => {
    switch (type) {
      case 'MEMBER_ADDED': return 'bg-green-50 border-green-200 text-green-700';
      case 'TASK_CREATED': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'TASK_COMPLETED': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'FILE_UPLOADED': return 'bg-purple-50 border-purple-200 text-purple-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleExport = () => {
    alert('Generating CSV export... Your download will start shortly.');
    // In a real app, we would generate a Blob and trigger download
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard &gt; Activity Log</p>
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <ClipboardList size={24}/> Workspace Activity Log
          </h2>
          <p className="text-sm text-gray-500 mt-1">Full audit trail of all workspace actions across members and tasks.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-all text-primary"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Restricted Access Banner simulated from screenshot */}
      <div className="bg-gray-50 border border-border p-4 rounded-xl flex items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
            🔒
          </div>
          <p className="text-xs font-bold text-primary uppercase tracking-wider">
            Restricted Access <span className="font-medium text-gray-500 normal-case ml-2">— Visible to Project Owner and Managers only.</span>
          </p>
        </div>
        <span className="text-[9px] font-extrabold tracking-widest bg-primary text-white px-2 py-1 rounded shadow-sm">ROLE RESTRICTED</span>
      </div>

      {/* Filters section */}
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-border flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-2">
          <Filter size={14}/> Filter Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar size={12}/> Date Range
            </label>
            <div className="flex items-center gap-2">
              <input type="date" className="flex-1 p-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:border-primary bg-white shadow-inner" />
              <span className="text-xs text-gray-400 font-bold">TO</span>
              <input type="date" className="flex-1 p-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:border-primary bg-white shadow-inner" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <User size={12}/> Member
            </label>
            <select className="p-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:border-primary bg-white shadow-inner cursor-pointer">
              <option>All Members</option>
              <option>James Dawson</option>
              <option>Marcus Reid</option>
              <option>Sarah Mitchell</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <ClipboardList size={12}/> Action Type
            </label>
            <div className="flex gap-2">
              <select className="flex-1 p-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 focus:outline-none focus:border-primary bg-white shadow-inner cursor-pointer">
                <option>All Action Types</option>
                <option>Member Added</option>
                <option>Task Created</option>
                <option>Status Updated</option>
              </select>
              <button className="px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm transition-all">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
             Showing 8 of 24 entries
          </span>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Sort by:</label>
            <select className="p-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-primary focus:outline-none bg-white cursor-pointer shadow-sm">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/50 font-extrabold">
                <th className="p-4 w-16 text-center">#</th>
                <th className="p-4 w-48">Action Type</th>
                <th className="p-4">Description</th>
                <th className="p-4 w-48">Performed By</th>
                <th className="p-4 w-36">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? activities.map((act, index) => (
                <tr key={act.log_id} className="border-b border-border hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 text-center font-mono text-xs text-gray-400">{index + 1}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-extrabold tracking-widest px-2.5 py-1 border rounded-lg shadow-sm select-none ${getTypeStyles(act.action_type)}`}>
                      {act.action_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-primary font-medium leading-relaxed">
                    {act.entity_type} {act.action_type.toLowerCase().replace('_', ' ')}: {act.new_value?.detail || 'No details available'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <img src={`https://ui-avatars.com/api/?name=${act.actor_user_id}&background=random`} alt="User" className="w-7 h-7 rounded-full shadow-sm border border-white" />
                      <div>
                        <p className="text-xs font-bold text-primary">User {act.actor_user_id.slice(0,8)}</p>
                        <p className="text-[9px] font-semibold text-gray-400 uppercase mt-0.5">Contributor</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-bold text-primary">{new Date(act.created_at).toLocaleDateString()}</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">{new Date(act.created_at).toLocaleTimeString()}</p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">No activity logs found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceActivity;
