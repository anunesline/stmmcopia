import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

import { SITE } from '../config/site';

const DEFAULT_MSG = 'Oi! Vi o site e gostaria de informações.';

export function buildWhatsAppUrl({
  number = SITE.whatsapp,
  name = '',
  phone = '',
  message = DEFAULT_MSG,
  product = '',
} = {}) {
  const parts = [];

  if (name) {
    parts.push(`Oi! Meu nome é ${name}.`);
  }

  if (product) {
    parts.push(`Tenho interesse no produto: ${product}.`);
  }

  parts.push(message || DEFAULT_MSG);

  if (phone) {
    parts.push(`Telefone: ${phone}`);
  }

  const text = parts.join('\n');

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(DEFAULT_MSG);

  const send = () => {
    if (!message.trim()) {
      return;
    }

    window.open(
      buildWhatsAppUrl({
        name,
        phone,
        message,
      }),
      '_blank',
      'noopener,noreferrer'
    );

    setOpen(false);
  };

  const quickOpen = () => {
    window.open(
      buildWhatsAppUrl(),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50"
      data-testid="whatsapp-widget"
    >
      {open && (
        <div className="absolute bottom-20 right-0 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-fade-up sm:w-[380px]">
          <div className="bg-gradient-to-r from-[#0B2861] to-[#0EA5E9] p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-lg">
                  Fale com a MM
                </div>

                <div className="text-xs text-sky-100">
                  Atendimento direto pelo WhatsApp
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                data-testid="close-chat-btn"
                className="rounded p-1 transition-colors hover:bg-white/10"
                aria-label="Fechar atendimento"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <Input
              data-testid="chat-name-input"
              placeholder="Seu nome (opcional)"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <Input
              data-testid="chat-phone-input"
              placeholder="Seu telefone (opcional)"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <Textarea
              data-testid="chat-message-input"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <Button
              type="button"
              data-testid="chat-send-btn"
              onClick={send}
              className="h-11 w-full gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57]"
            >
              <Send className="h-4 w-4" />
              Continuar no WhatsApp
            </Button>

            <button
              type="button"
              onClick={quickOpen}
              data-testid="quick-wpp-btn"
              className="w-full text-center text-xs text-[#0EA5E9] underline"
            >
              Ou abrir conversa diretamente
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        data-testid="whatsapp-fab"
        onClick={() => setOpen((currentValue) => !currentValue)}
        className="group flex h-14 items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 text-white shadow-2xl transition-all hover:scale-105 hover:bg-[#1ebe57] active:scale-95"
        aria-label="Fale no WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />

        <span className="hidden font-semibold sm:inline">
          Fale no WhatsApp
        </span>
      </button>
    </div>
  );
}