import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash;
    const match = hash.match(/session_id=([^&]+)/);
    if (!match) {
      navigate('/');
      return;
    }
    const sessionId = match[1];

    (async () => {
      try {
        const r = await api.post('/auth/session', { session_id: sessionId });
        localStorage.setItem('mm_token', r.data.session_token);
        setUser(r.data.user);
        window.history.replaceState(null, '', window.location.pathname);
        navigate('/admin', { state: { user: r.data.user } });
      } catch (e) {
        console.error('Auth callback failed', e);
        navigate('/');
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center" data-testid="auth-callback">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#0B2861] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Autenticando...</p>
      </div>
    </div>
  );
}
