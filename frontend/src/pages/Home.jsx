import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  MessageCircle,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { buildWhatsAppUrl } from '../components/WhatsAppWidget';
import { api } from '../lib/api';

const NUVEMSHOP_URL =
  'https://mmdistribuidoradelimpeza.lojavirtualnuvem.com.br/';

const cardVariants = {
  hidden: {
    opacity: 0,
    x: 90,
  },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.30 * index,
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [number, setNumber] = useState('554134032999');

  useEffect(() => {
    api
      .get('/products/featured')
      .then((response) => {
        setFeatured(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        setFeatured([]);
      });

    api
      .get('/settings')
      .then((response) => {
        if (response.data?.whatsapp_number) {
          setNumber(response.data.whatsapp_number);
        }
      })
      .catch(() => {});
  }, []);

  const heroWpp = buildWhatsAppUrl({ number });

  const benefits = [
    {
      title: 'Entrega rápida',
      description:
        'Agilidade e segurança no atendimento a toda a região.',
      icon: Truck,
    },
    {
      title: 'Mais de 500 produtos',
      description:
        'Linha completa de produtos de limpeza, descartáveis e papéis.',
      icon: ShoppingCart,
    },
    {
      title: 'Atendimento especializado',
      description:
        'Orientação para encontrar os melhores produtos para cada necessidade.',
      icon: Star,
    },
  ];

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative hero-mesh text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 animate-fade-up">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] leading-[1.04] text-[#7DD3FC]">
              <span className="lg:whitespace-nowrap">
                Tudo para{' '}
                <span className="text-white">limpeza,</span>
              </span>

              <br />

              <span>em um só lugar.</span>
            </h1>

            <div className="space-y-2.5 text-base sm:text-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                <span>Mais de 500 produtos</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                <span>Compra online</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                <span>Atendimento especializado</span>
              </div>
            </div>

            <p className="text-slate-200 max-w-xl text-base sm:text-lg leading-relaxed">
              Encontre tudo o que você precisa para sua casa, empresa ou
              condomínio.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={heroWpp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-11 px-6 bg-[#25D366] hover:bg-[#1ebe57] hover:-translate-y-0.5 hover:shadow-lg text-white gap-2 transition-all duration-300">
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </Button>
              </a>

              <a
                href={NUVEMSHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-11 px-6 bg-[#F59E0B] hover:bg-[#D97706] hover:-translate-y-0.5 hover:shadow-lg text-white gap-2 transition-all duration-300">
                  <ShoppingCart className="w-4 h-4" />
                  Acessar Loja Online
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.01,
                  }}
                  className="group min-h-[116px] rounded-2xl border border-white/20 bg-white/95 p-5 text-[#0B2861] shadow-lg backdrop-blur transition-colors duration-300 hover:border-sky-300 hover:shadow-2xl"
                >
                  <div className="flex h-full items-center gap-5">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-[#0B2861] transition-all duration-300 group-hover:bg-[#0EA5E9] group-hover:text-white group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div>
                      <h2 className="font-display text-2xl leading-tight">
                        {benefit.title}
                      </h2>

                      <p className="mt-1.5 text-base leading-relaxed text-slate-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-4">
          <h2 className="font-display text-3xl lg:text-5xl text-[#0B2861]">
            Produtos em destaque
          </h2>
        </div>

        <p className="text-slate-600 max-w-2xl mb-10">
          Conheça alguns dos produtos mais procurados pelos nossos clientes.
          Para visualizar o catálogo completo e realizar sua compra, acesse
          nossa Loja Online.
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
          data-testid="featured-grid"
        >
          {featured.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              number={number}
            />
          ))}
        </div>
      </section>
    </div>
  );
}