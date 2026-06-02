import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const dest = location.state?.from || '/admin';
      navigate(dest);
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === 'string' ? d : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0B2861] flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl text-[#0B2861]">Área administrativa</h1>
          <p className="text-slate-500 mt-2 text-sm">Entre com seu e-mail e senha</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700" data-testid="login-error">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}

          <div>
            <Label className="text-xs uppercase tracking-wider text-slate-500">E-mail</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                data-testid="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="pl-9 h-11"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-slate-500">Senha</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                data-testid="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 h-11"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            data-testid="login-submit"
            disabled={loading}
            className="w-full h-11 bg-[#0B2861] hover:bg-[#1E3A8A]"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Acesso restrito · MM Comércio e Distribuidora
        </p>
      </div>
    </div>
  );
}
