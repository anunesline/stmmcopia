import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { api, resolveImg } from '../lib/api';
import { buildWhatsAppUrl } from '../components/WhatsAppWidget';

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [number, setNumber] = useState('554134032999');

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setP(r.data));
    api.get('/settings').then((r) => setNumber(r.data.whatsapp_number)).catch(() => {});
  }, [id]);

  if (!p) return <div className="max-w-7xl mx-auto px-4 py-16">Carregando...</div>;

  const wppUrl = buildWhatsAppUrl({ number, product: p.name });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10" data-testid="product-detail-page">
      <Link to="/produtos" className="text-sm text-slate-500 hover:text-[#0B2861] inline-flex items-center gap-1 mb-6">
        <ChevronLeft className="w-4 h-4" /> Voltar ao catálogo
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
          {/* Imagem corrigida: resolveImg aplicado e atributo img duplicado removido */}
          <img 
            src={resolveImg(p.image)} 
            alt={p.name} 
            className="max-h-[480px] object-contain"
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        </div>

        <div className="space-y-5">
          <h1 className="font-display text-3xl lg:text-5xl text-[#0B2861] leading-tight">{p.name}</h1>
          <p className="text-slate-600 leading-relaxed">{p.description}</p>

          <a href={wppUrl} target="_blank" rel="noopener noreferrer" data-testid="detail-wpp-btn">
            <Button className="w-full sm:w-auto h-12 px-8 bg-[#25D366] hover:bg-[#1ebe57] text-white gap-2 text-sm uppercase tracking-wider">
              <MessageCircle className="w-4 h-4" /> Quero este produto
            </Button>
          </a>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
              <Truck className="w-4 h-4 text-[#0EA5E9] mt-0.5" />
              <span>Entrega rápida em todo o PR</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
              <ShieldCheck className="w-4 h-4 text-[#0EA5E9] mt-0.5" />
              <span>Produto original com NF-e</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
