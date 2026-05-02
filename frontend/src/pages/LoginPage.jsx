import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Mail, ArrowRight, Loader2, Lock } from 'lucide-react';
import { authApi } from '../api';
import Footer from '../components/Footer';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setLoading(true);
      setError('');

      const res = await authApi.simulateSession(email.trim());
      if (res.success) {
        localStorage.setItem('activeUserId', res.data.user_id);
        localStorage.setItem('activeUserEmail', email.trim());
        
        const searchParams = new URLSearchParams(window.location.search);
        const invitationId = searchParams.get('invitationId');
        
        if (invitationId) {
          window.location.href = `/invite?invitationId=${invitationId}`;
        } else {
          window.location.href = '/';
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col pt-20 relative overflow-hidden font-sans">
      
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-2xl shadow-2xl">
              <Globe size={36} />
            </div>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            {isLogin ? 'Command Center' : 'System Registry'}
          </h2>
          <p className="mt-3 text-xs font-black text-black/40 uppercase tracking-[0.3em]">
            National Freelance Platform • Identity Portal
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-6 border-2 border-black sm:px-12 shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mb-3">
                  Authorized Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-black">
                    <Mail size={18} className="text-black/30 group-focus-within:text-black transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-black/10 focus:border-black rounded-none text-black font-black placeholder-black/20 focus:outline-none sm:text-sm transition-all"
                    placeholder="IDENTIFIER@DOMAIN.COM"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pass" className="block text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mb-3">
                  Security Protocol
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-black">
                    <Lock size={18} className="text-black/30 group-focus-within:text-black transition-colors" />
                  </div>
                  <input
                    id="pass"
                    name="pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-black/10 focus:border-black rounded-none text-black font-black placeholder-black/20 focus:outline-none sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-black text-white p-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                  <div className="w-1 h-4 bg-white"></div> {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-3 py-5 px-4 bg-black text-white text-xs font-black uppercase tracking-[0.3em] hover:invert transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <>{isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black text-black/40 hover:text-black uppercase tracking-[0.3em] transition-colors border-b border-transparent hover:border-black"
              >
                {isLogin ? "Request Access Credentials" : "Return to Identification"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
