import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { api } from '../lib/api';

const DEFAULT_MSG = 'Oi! Vi o site e gostaria de informações.';

export function buildWhatsAppUrl({ number = '554134032999', name = '', phone = '', message = DEFAULT_MSG, product = '' } = {}) {
  const parts = [];
  if (name) parts.push(`Oi! Meu nome é ${name}.`);
  if (product) parts.push(`Tenho interesse no produto: ${product}.`);
  parts.push(message || DEFAULT_MSG);
  if (phone) parts.push(`Telefone: ${phone}`);
  const text = parts.join('\n');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(DEFAULT_MSG);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState('554134032999');

  useEffect(() => {
    api.get('/settings').then((r) => setNumber(r.data.whatsapp_number)).catch(() => {});
  }, []);

  const send = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const r = await api.post('/chat/whatsapp', { name, phone, message });
      window.open(r.data.whatsapp_url, '_blank');
      setOpen(false);
    } catch {
      window.open(buildWhatsAppUrl({ number, name, phone, message }), '_blank');
    } finally {
      setLoading(false);
    }
  };

  const quickOpen = () => {
    window.open(buildWhatsAppUrl({ number }), '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50" data-testid="whatsapp-widget">
      {open && (
        <div className="absolute bottom-20 right-0 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-up">
          <div className="bg-gradient-to-r from-[#0B2861] to-[#0EA5E9] p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-lg">Fale com a MM</div>
                <div className="text-xs text-sky-100">Atendimento direto pelo WhatsApp</div>
              </div>
              <button onClick={() => setOpen(false)} data-testid="close-chat-btn" className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <Input
              data-testid="chat-name-input"
              placeholder="Seu nome (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              data-testid="chat-phone-input"
              placeholder="Seu telefone (opcional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Textarea
              data-testid="chat-message-input"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              data-testid="chat-send-btn"
              onClick={send}
              disabled={loading}
              className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white gap-2 h-11"
            >
              <Send className="w-4 h-4" /> {loading ? 'Abrindo...' : 'Continuar no WhatsApp'}
            </Button>
            <button onClick={quickOpen} data-testid="quick-wpp-btn" className="text-xs text-[#0EA5E9] underline w-full text-center">
              Ou abrir conversa diretamente
            </button>
          </div>
        </div>
      )}

      <button
        data-testid="whatsapp-fab"
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-2xl transition-all hover:scale-105 active:scale-95 rounded-full pl-4 pr-5 h-14"
        aria-label="Fale no WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold hidden sm:inline">Fale no WhatsApp</span>
      </button>
    </div>
  );
}
