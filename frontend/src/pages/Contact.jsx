import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { Button } from '../components/ui/button';
import { buildWhatsAppUrl } from '../components/WhatsAppWidget';
import { api } from '../lib/api';

export default function Contact() {
  const [number, setNumber] = useState('554134032999');

  useEffect(() => {
    api.get('/settings').then((r) => setNumber(r.data.whatsapp_number)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16" data-testid="contact-page">
      <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-3">Fale conosco</div>
      <h1 className="font-display text-4xl sm:text-5xl text-[#0B2861] leading-tight mb-3">Estamos prontos para atender.</h1>
      <p className="text-slate-600 max-w-2xl mb-12">
        A forma mais rápida de falar com a MM é pelo WhatsApp. Nossa equipe responde rapidamente
        com preços, disponibilidade e prazos de entrega.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#0B2861] text-white rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-30" />
          <div className="relative">
            <h2 className="font-display text-2xl mb-6">Atendimento direto</h2>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#7DD3FC] mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-sky-300 mb-1">WhatsApp & telefone</div>
                  <div className="font-semibold text-lg">(41) 3403-2999</div>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-[#7DD3FC] mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-sky-300 mb-1">Horário</div>
                  <div>Segunda a sexta · 9h às 18h</div>
                  <div>Sábado · 9h às 13h</div>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#7DD3FC] mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-sky-300 mb-1">Endereço</div>
                  <div>R. Rio Trombetas, 493</div>
                  <div>Weissópolis · Pinhais — PR</div>
                  <div>CEP 83322-280</div>
                </div>
              </li>
            </ul>
            <a
              href={buildWhatsAppUrl({ number })}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-wpp-btn"
              className="inline-block mt-8"
            >
              <Button className="bg-[#25D366] hover:bg-[#1ebe57] h-12 px-6 gap-2 text-sm uppercase tracking-wider">
                <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="font-display text-2xl text-[#0B2861] mb-4">Redes sociais</h2>
          <p className="text-sm text-slate-500 mb-6">Acompanhe lançamentos, promoções e dicas de limpeza profissional.</p>
          <div className="grid grid-cols-2 gap-3">
            <a href="https://www.instagram.com/redemmdistribuidoras" target="_blank" rel="noopener noreferrer" data-testid="contact-instagram" className="flex flex-col items-center gap-2 border border-slate-200 rounded-xl p-5 hover:border-[#0EA5E9] hover:bg-slate-50 transition-all">
              <Instagram className="w-6 h-6 text-[#0B2861]" />
              <span className="text-xs font-medium">Instagram</span>
              <span className="text-[10px] text-slate-500">@redemmdistribuidoras</span>
            </a>
            <a href="https://www.facebook.com/redemmdistribuidoras" target="_blank" rel="noopener noreferrer" data-testid="contact-facebook" className="flex flex-col items-center gap-2 border border-slate-200 rounded-xl p-5 hover:border-[#0EA5E9] hover:bg-slate-50 transition-all">
              <Facebook className="w-6 h-6 text-[#0B2861]" />
              <span className="text-xs font-medium">Facebook</span>
              <span className="text-[10px] text-slate-500">@redemmdistribuidoras</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
