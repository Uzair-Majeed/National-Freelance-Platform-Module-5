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

  // ── Already responded ───────────────────────────────────────────────────────
  if (invitation?.status !== 'PENDING') {
    return (
      <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 flex flex-col items-center text-center gap-6 animate-slide-up">
          <div className="w-16 h-16 bg-gray-50 border rounded-2xl flex items-center justify-center text-gray-400 shadow-inner">
            <Mail size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">Already Responded</h3>
            <p className="text-sm text-gray-500 mt-2">
              This invitation has already been <strong>{invitation.status.toLowerCase()}</strong>.
            </p>
          </div>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-primary text-white rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm hover:bg-opacity-90 transition-all">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ── Active invitation ───────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 flex flex-col items-center text-center gap-6 animate-slide-up">

        <div className="w-16 h-16 bg-primary/5 border rounded-2xl flex items-center justify-center text-primary shadow-inner">
          <Mail size={32} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-primary leading-snug">Workspace Invitation</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            You have been invited to join a workspace by{' '}
            <span className="font-bold text-primary">User {invitation.invited_by.slice(0, 8)}</span>.
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Invite sent to: <span className="font-semibold text-primary">{invitation.invitee_email}</span>
          </p>
        </div>

        <div className="w-full bg-gray-50 border border-border rounded-xl p-4 flex flex-col gap-2 text-xs text-left font-medium text-gray-600">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Access to all collaborative kanban boards.
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Default role: <strong className="ml-1 text-primary">MEMBER</strong>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Admins can promote your role at any time.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full pt-2">
          <button
            onClick={() => handleRespond('DECLINED')}
            disabled={responding}
            className="flex-1 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-primary rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <X size={14} /> Decline
          </button>
          <button
            onClick={() => handleRespond('ACCEPTED')}
            disabled={responding}
            className="flex-1 py-2.5 bg-primary text-white hover:bg-opacity-90 rounded-lg text-xs font-extrabold tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {responding ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Accept &amp; Join
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvitationPage;
