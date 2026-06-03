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
    api.get('/products?featured=true').then((r) => setFeatured(Array.isArray(r.data) ? r.data : [])).catch(() => setFeatured([]));
    api.get('/categories').then((r) => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => setCategories([]));
    api.get('/settings').then((r) => setNumber(r.data.whatsapp_number)).catch(() => {});
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
            <div className="flex flex-wrap gap-6 pt-6 text-sm">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#7DD3FC]" /> Entrega rápida</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#7DD3FC]" /> Marcas certificadas</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#7DD3FC]" /> (41) 3403-2999</div>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative animate-float">
              <div className="absolute -inset-8 bg-[#0EA5E9]/20 blur-3xl rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1585421514738-01798e348b17?crop=entropy&cs=srgb&fm=jpg&w=900&q=85"
                alt="Produtos de limpeza profissionais"
                className="relative rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-[#0B2861] rounded-lg shadow-xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Linha</div>
                <div className="font-display text-2xl">Azulim</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES AZULIM */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-2">Destaques</div>
            <h2 className="font-display text-3xl lg:text-5xl text-[#0B2861]">Linha Azulim</h2>
            <p className="text-slate-500 mt-2 max-w-xl">Os profissionais que mais saem da nossa distribuidora.</p>
          </div>
          <Link to="/produtos" className="text-sm text-[#0B2861] underline underline-offset-4 hover:text-[#0EA5E9]">Ver todos os produtos</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5" data-testid="featured-grid">
          {featured?.map((p) => <ProductCard key={p.product_id} product={p} number={number} />)}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-2">Categorias</div>
            <h2 className="font-display text-3xl lg:text-4xl text-[#0B2861]">O que distribuímos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.category_id}
                to={`/produtos?category=${c.slug}`}
                data-testid={`category-${c.slug}`}
                className="group bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-[#0B2861] hover:text-white hover:border-[#0B2861] transition-all"
              >
                <div className="w-10 h-10 rounded-md bg-white border border-slate-200 group-hover:bg-[#0EA5E9] group-hover:border-[#0EA5E9] flex items-center justify-center mb-4 transition-colors">
                  <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-[#0B2861] to-[#0EA5E9] group-hover:from-white group-hover:to-white" />
                </div>
                <div className="font-display text-lg">{c.name}</div>
                <div className="text-xs mt-1 opacity-70 flex items-center gap-1">Ver produtos <ArrowRight className="w-3 h-3" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMO COMPRAR */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#0EA5E9] font-semibold mb-2">Simples assim</div>
          <h2 className="font-display text-3xl lg:text-5xl text-[#0B2861]">Como comprar</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { n: '01', t: 'Escolha o produto', d: 'Navegue pelo catálogo e selecione o que precisa.' },
            { n: '02', t: 'Clique no WhatsApp', d: 'Use o botão "Quero este produto" e fale com a gente.' },
            { n: '03', t: 'Receba atendimento', d: 'Confirmamos disponibilidade, preço e formas de pagamento.' },
            { n: '04', t: 'Combine a entrega', d: 'Combinamos o envio rápido para sua região.' },
          ].map((s, i) => (
            <div key={i} className="relative bg-white border border-slate-200 rounded-xl p-6 hover:border-[#0EA5E9] hover:shadow-md transition-all" data-testid={`step-${s.n}`}>
              <div className="font-display text-5xl text-[#0EA5E9]/20 absolute top-3 right-4">{s.n}</div>
              <div className="font-display text-xl text-[#0B2861] relative">{s.t}</div>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed relative">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href={heroWpp} target="_blank" rel="noopener noreferrer" data-testid="como-comprar-wpp">
            <Button className="h-12 px-8 bg-[#25D366] hover:bg-[#1ebe57] text-white gap-2 text-sm uppercase tracking-wider">
              <MessageCircle className="w-4 h-4" /> Começar agora pelo WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-20">
        <div className="bg-[#0B2861] rounded-2xl p-8 lg:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center text-white relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-30" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.25em] text-[#7DD3FC] font-semibold mb-3">Para empresas, condomínios e comércios</div>
            <h3 className="font-display text-3xl lg:text-4xl mb-3">Pedidos em quantidade?</h3>
            <p className="text-slate-200 leading-relaxed">
              Solicite uma cotação personalizada pelo WhatsApp e fale com nosso time comercial.
            </p>
          </div>
          <a href={heroWpp} target="_blank" rel="noopener noreferrer" data-testid="cotacao-wpp" className="relative">
            <Button className="h-12 px-7 bg-white text-[#0B2861] hover:bg-[#0EA5E9] hover:text-white gap-2 text-sm uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4" /> Pedir cotação
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
