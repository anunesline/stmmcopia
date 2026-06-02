import React, { useEffect, useState } from 'react';
import { Trash2, MessageCircle, Phone, Package, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function AdminLeads() {
  const { user, loading, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [whatsappNum, setWhatsappNum] = useState('554134032999');

  const load = async () => {
    setRefreshing(true);
    try {
      const r = await api.get('/admin/leads');
      setLeads(r.data);
    } catch {
      toast.error('Erro ao carregar leads');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      load();
      api.get('/settings').then((r) => setWhatsappNum(r.data.whatsapp_number)).catch(() => {});
    }
  }, [user]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-500">Carregando...</div>;

  if (!user) {
    return null; // handled by RequireAuth
  }

  if (!user.is_admin) {
    return <div className="max-w-md mx-auto px-4 py-20 text-center text-slate-500">Acesso restrito.</div>;
  }

  const remove = async (l) => {
    if (!window.confirm('Excluir este lead?')) return;
    await api.delete(`/admin/leads/${l.message_id}`);
    toast.success('Lead removido');
    load();
  };

  const replyWpp = (l) => {
    const parts = [];
    if (l.name) parts.push(`Olá ${l.name},`);
    parts.push('estamos retornando seu contato sobre a MM Comércio e Distribuidora.');
    if (l.product) parts.push(`Sobre o produto: ${l.product}.`);
    const text = encodeURIComponent(parts.join(' '));
    // If the lead included a phone, prefer it; else use main WhatsApp
    const digits = (l.phone || '').replace(/\D/g, '');
    const target = digits.length >= 10 ? (digits.length === 11 || digits.length === 10 ? `55${digits}` : digits) : whatsappNum;
    window.open(`https://wa.me/${target}?text=${text}`, '_blank');
  };

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (l.name || '').toLowerCase().includes(s)
      || (l.phone || '').toLowerCase().includes(s)
      || (l.product || '').toLowerCase().includes(s)
      || (l.message || '').toLowerCase().includes(s);
  });

  const stats = {
    total: leads.length,
    withProduct: leads.filter((l) => l.product).length,
    withPhone: leads.filter((l) => l.phone).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10" data-testid="admin-leads-page">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-2">Painel admin</div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#0B2861]">Leads do chat WhatsApp</h1>
          <p className="text-slate-500 mt-1">Mensagens enviadas pelos visitantes do site.</p>
        </div>
        <Button onClick={load} variant="outline" className="gap-2" data-testid="refresh-leads"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Atualizar</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">Total de leads</div>
          <div className="font-display text-3xl text-[#0B2861] mt-1">{stats.total}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">Com produto</div>
          <div className="font-display text-3xl text-[#0EA5E9] mt-1">{stats.withProduct}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">Com telefone</div>
          <div className="font-display text-3xl text-[#25D366] mt-1">{stats.withPhone}</div>
        </div>
      </div>

      <div className="mb-4">
        <Input
          data-testid="leads-search"
          placeholder="Buscar por nome, telefone, produto ou mensagem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <div>Nenhum lead {search ? 'encontrado para esta busca' : 'ainda. Quando alguém usar o chat do site, vai aparecer aqui.'}</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((l) => (
              <div key={l.message_id} className="p-5 hover:bg-slate-50" data-testid={`lead-${l.message_id}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-display text-lg text-[#0B2861]">{l.name || 'Sem nome'}</span>
                      {l.phone && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          <Phone className="w-3 h-3" /> {l.phone}
                        </span>
                      )}
                      {l.product && (
                        <span className="inline-flex items-center gap-1 text-xs bg-[#0EA5E9]/10 text-[#0B2861] px-2 py-1 rounded">
                          <Package className="w-3 h-3" /> {l.product}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 ml-auto">
                        {new Date(l.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{l.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      data-testid={`reply-${l.message_id}`}
                      size="sm"
                      onClick={() => replyWpp(l)}
                      className="bg-[#25D366] hover:bg-[#1ebe57] gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Responder
                    </Button>
                    <button onClick={() => remove(l)} className="p-2 text-red-500 hover:text-red-700" data-testid={`del-lead-${l.message_id}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
