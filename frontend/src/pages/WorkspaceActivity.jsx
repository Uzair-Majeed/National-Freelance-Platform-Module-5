import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Filter, Calendar, Download, Zap, Edit3, Trash2, UserPlus, Info } from 'lucide-react';
import { activityApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';

const ROW_STYLES = {
  CREATED:  'bg-green-100/60 hover:bg-green-100/90 border-green-200',
  UPDATED:  'bg-blue-100/60 hover:bg-blue-100/90 border-blue-200',
  DELETED:  'bg-red-100/60 hover:bg-red-100/90 border-red-200',
  ASSIGNED: 'bg-purple-100/60 hover:bg-purple-100/90 border-purple-200',
  ROLE_UPDATED: 'bg-amber-100/60 hover:bg-amber-100/90 border-amber-200',
};

const LABEL_STYLES = {
  CREATED:  { bg: 'bg-green-600', icon: <Zap size={12} /> },
  UPDATED:  { bg: 'bg-blue-600',  icon: <Edit3 size={12} /> },
  DELETED:  { bg: 'bg-red-600',   icon: <Trash2 size={12} /> },
  ASSIGNED: { bg: 'bg-purple-600', icon: <UserPlus size={12} /> },
  ROLE_UPDATED: { bg: 'bg-amber-600', icon: <ShieldCheck size={12} /> },
};

import { ShieldCheck } from 'lucide-react';

import LoadingSpinner from '../components/LoadingSpinner';

const WorkspaceActivity = () => {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const [activities, setActivities] = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);

  const [filterType, setFilterType]   = useState('');
  const [filterFrom, setFilterFrom]   = useState('');
  const [filterTo, setFilterTo]       = useState('');

  useEffect(() => {
    if (!workspaceId) { navigate('/'); return; }
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await activityApi.getByWorkspace(workspaceId);
        if (res.success) {
          setActivities(res.data);
          setFiltered(res.data);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [workspaceId, navigate]);

  const applyFilters = () => {
    let data = [...activities];
    if (filterType) data = data.filter(a => a.action_type === filterType);
    if (filterFrom) data = data.filter(a => new Date(a.created_at) >= new Date(filterFrom));
    if (filterTo) data = data.filter(a => new Date(a.created_at) <= new Date(filterTo + 'T23:59:59'));
    setFiltered(data);
  };

  const resetFilters = () => {
    setFilterType(''); setFilterFrom(''); setFilterTo('');
    setFiltered(activities);
  };

  const handleExport = () => {
    const csv = [
      ['#', 'Action Type', 'Entity', 'Actor', 'Timestamp'],
      ...filtered.map((a, i) => [i + 1, a.action_type, a.entity_type, a.actor_email || 'System', new Date(a.created_at).toLocaleString()])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'activity.csv'; a.click();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const actionTypes = [...new Set(activities.map(a => a.action_type))];

  const btnClass = "flex items-center justify-center gap-2 px-6 py-3 bg-black text-white border border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95";

  return (
    <div className="flex flex-col gap-6 pb-12 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-sm text-gray-800 uppercase font-black tracking-[0.2em] mb-1">AUDIT SEQUENCE</p>
          <h2 className="text-3xl font-black text-primary flex items-center gap-3">
            <ClipboardList size={28} /> Activity Log
          </h2>
          <p className="text-xs font-black text-gray-800 uppercase tracking-widest mt-2">{activities.length} TOTAL SEQUENCE EVENTS</p>
        </div>
        <button onClick={handleExport} className={btnClass}>
          <Download size={16} /> Export Sequence
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-border flex flex-col gap-6">
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-800 flex items-center gap-2">
          <Filter size={14} /> Filter Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Start Date</label>
            <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} className="p-3 border border-border rounded-xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary bg-gray-50 shadow-inner" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> End Date</label>
            <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} className="p-3 border border-border rounded-xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary bg-gray-50 shadow-inner" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><ClipboardList size={12} /> Sequence Type</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="flex-1 p-3 border border-border rounded-xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary bg-gray-50 shadow-inner cursor-pointer">
                <option value="">All Sequences</option>
                {actionTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={applyFilters} className={btnClass}>Apply</button>
                <button onClick={resetFilters} className={btnClass}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
          <span className="text-xs font-black text-gray-800 uppercase tracking-widest">Visibility: {filtered.length} entries</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Real-time Stream Active</span>
          </div>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border text-xs font-black uppercase tracking-[0.2em] text-gray-800 bg-white">
                <th className="p-6 w-16 text-center">#</th>
                <th className="p-6 w-56">Sequence Action</th>
                <th className="p-6">Entity Context</th>
                <th className="p-6 w-56">Initiating Actor</th>
                <th className="p-6 w-48 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? filtered.map((act, index) => {
                const rowClass = ROW_STYLES[act.action_type] || 'hover:bg-gray-50/80';
                const label    = LABEL_STYLES[act.action_type] || { bg: 'bg-gray-600', icon: <Info size={12} /> };
                return (
                  <tr key={act.id} className={`transition-all group border-l-4 ${rowClass} border-l-transparent hover:border-l-primary`}>
                    <td className="p-6 text-center font-black text-xs text-gray-400 group-hover:text-primary">#{index + 1}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${label.bg} text-white flex items-center justify-center shadow-md shrink-0`}>
                          {label.icon}
                        </div>
                        <span className="text-xs font-black tracking-widest text-primary uppercase">{act.action_type.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-primary uppercase tracking-tight group-hover:translate-x-1 transition-transform">{act.entity_type}</span>
                        <span className="text-[10px] font-black text-gray-800 mt-1 uppercase tracking-widest bg-white/50 w-fit px-1.5 py-0.5 rounded border border-black/5">REF: {act.entity_id}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center text-xs font-black text-primary shadow-sm group-hover:bg-black group-hover:text-white transition-all">
                          {(act.actor_email || 'S').substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-xs font-black text-primary uppercase tracking-tight">{act.actor_email || 'SYSTEM CORE'}</p>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">{new Date(act.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] font-black text-gray-800 mt-1 uppercase tracking-[0.2em] opacity-60">{new Date(act.created_at).toLocaleTimeString()}</p>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="5" className="p-24 text-center text-gray-800 font-black uppercase tracking-[0.5em] italic">No Sequence Data Available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceActivity;
