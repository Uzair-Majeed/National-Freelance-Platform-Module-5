import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { workspaceApi } from '../api';

const InvitationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get('invitationId');

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [responding, setResponding] = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!invitationId) {
      setError('No invitation ID provided in URL. Expected: /invite?invitationId=...');
      setLoading(false);
      return;
    }

    // NEW: Check for login before loading invitation
    const activeUserId = localStorage.getItem('activeUserId');
    if (!activeUserId) {
      // Redirect to login with invitation ID so we can come back
      navigate(`/?invitationId=${invitationId}`);
      return;
    }

    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const res = await workspaceApi.getInvitationById(invitationId);
        if (res.success) {
          setInvitation(res.data);
        } else {
          setError('Invitation not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load invitation.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [invitationId, navigate]);

  const handleRespond = async (status) => {
    try {
      setResponding(true);
      await workspaceApi.respondToInvitation(invitationId, status);
      if (status === 'ACCEPTED') {
        navigate('/dashboard');
      } else {
        navigate('/denied');
      }
    } catch (err) {
      alert('Failed to respond to invitation: ' + err.message);
    } finally {
      setResponding(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-primary animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Loading invitation details…</p>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 flex flex-col items-center text-center gap-6 animate-slide-up">
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center text-red-400 shadow-inner">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">Invalid Invitation</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm hover:bg-opacity-90 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ── Already responded or Null ───────────────────────────────────────────────
  if (invitation && invitation.status.toUpperCase() !== 'PENDING') {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-white border-[8px] border-black max-w-md w-full p-12 flex flex-col items-center text-center gap-8 shadow-2xl">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center">
            <Mail size={40} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-black uppercase tracking-tighter">Transmission Complete</h3>
            <p className="text-sm font-black text-black/40 mt-4 uppercase tracking-[0.2em]">
              This invitation has already been <span className="text-black">{invitation.status}</span>.
            </p>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:invert transition-all">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Active invitation ───────────────────────────────────────────────────────
  if (!invitation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white border-[8px] border-black max-w-md w-full p-12 flex flex-col items-center text-center gap-8 shadow-2xl">

        <div className="w-20 h-20 bg-black text-white flex items-center justify-center">
          <Mail size={40} />
        </div>

        <div>
          <h3 className="text-4xl font-black text-black uppercase tracking-tighter leading-tight">Incoming Linkage</h3>
          <p className="text-sm font-black text-black/40 mt-6 uppercase tracking-[0.2em] leading-relaxed">
            Entity <span className="text-black font-black">{invitation.inviter_email || 'ADMIN'}</span> requests your presence in workspace:
          </p>
          <div className="mt-8 p-6 bg-black/5 border-4 border-black border-dashed">
            <p className="text-2xl font-black text-black uppercase tracking-tighter">{invitation.workspace_name || 'Strategic Hub'}</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 text-left">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-black"></div>
             <p className="text-[10px] font-black text-black uppercase tracking-widest">Full Command Privileges</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-black"></div>
             <p className="text-[10px] font-black text-black uppercase tracking-widest">Secure Data Access</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full mt-4">
          <button
            onClick={() => handleRespond('DECLINED')}
            disabled={responding}
            className="flex-1 py-5 bg-white border-4 border-black text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all disabled:opacity-50"
          >
            Abort
          </button>
          <button
            onClick={() => handleRespond('ACCEPTED')}
            disabled={responding}
            className="flex-1 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:invert transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {responding ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Join Workspace
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvitationPage;
