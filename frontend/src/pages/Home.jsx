import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, MessageCircle, ShoppingBag, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { buildWhatsAppUrl } from '../components/WhatsAppWidget';
import { api } from '../lib/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [number, setNumber] = useState('554134032999');

  useEffect(() => {
    // CORREÇÃO: Agora chamamos a rota específica de destaques
    api.get('/products/featured')
      .then((r) => setFeatured(Array.isArray(r.data) ? r.data : []))
      .catch(() => setFeatured([]));

    api.get('/categories')
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCategories([]));

    api.get('/settings')
      .then((r) => setNumber(r.data.whatsapp_number))
      .catch(() => {});
  }, []);

  const heroWpp = buildWhatsAppUrl({ number });

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative hero-mesh text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
              Pinhais · PR · Entrega para toda a região
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02]">
              Produtos de limpeza profissionais<br />
              <span className="text-[#7DD3FC]">com qualidade e confiança.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed">
              Atendimento rápido pelo WhatsApp e entrega para sua região. Mais de 20 anos
              abastecendo empresas, condomínios e residências.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={heroWpp} target="_blank" rel="noopener noreferrer" data-testid="hero-wpp-btn">
                <Button className="h-12 px-6 bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm uppercase tracking-wider gap-2">
                  <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                </Button>
              </a>
              <Link to="/produtos" data-testid="hero-produtos-btn">
                <Button variant="outline" className="h-12 px-6 bg-transparent border-white/30 text-white hover:bg-white/10 text-sm uppercase tracking-wider gap-2">
                  Ver produtos <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-2">Destaques</div>
            <h2 className="font-display text-3xl lg:text-5xl text-[#0B2861]">Produtos Selecionados</h2>
          </div>
          <Link to="/produtos" className="text-sm text-[#0B2861] underline underline-offset-4 hover:text-[#0EA5E9]">Ver todos os produtos</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5" data-testid="featured-grid">
          {featured?.map((p) => <ProductCard key={p.product_id} product={p} number={number} />)}
        </div>
      </section>

      {/* CATEGORIAS E RESTANTE DO CÓDIGO ... */}
      {/* (Mantenha o resto do seu código de categorias e rodapé aqui conforme original) */}
    </div>
  );
}
