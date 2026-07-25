import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle,
  MessageCircle,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { buildWhatsAppUrl } from '../components/WhatsAppWidget';
import { SITE } from '../config/site';

const NUVEMSHOP_URL = SITE.loja;

const cardVariants = {
  hidden: {
    opacity: 0,
    x: 90,
  },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 * index,
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const brandVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * index,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const featuredBrands = [
  {
    name: 'Start',
    searchTerm: 'Start',
    logo: '/images/brands/start.jpg',
  },
  {
    name: 'Azulim',
    searchTerm: 'Azulim',
    logo: '/images/brands/azulim.png',
  },
  {
    name: 'Deoline',
    searchTerm: 'Deoline',
    logo: '/images/brands/deoline.jpg',
  },
  {
    name: 'Premisse',
    searchTerm: 'Premisse',
    logo: '/images/brands/premisse.jpg',
  },
  {
    name: 'Zip',
    searchTerm: 'Zip',
    logo: null,
  },
  {
    name: 'Verplast',
    searchTerm: 'Verplast',
    logo: '/images/brands/verplast.png',
  },
  {
    name: 'Bompack',
    searchTerm: 'Bompack',
    logo: '/images/brands/bompack.png',
  },
  {
    name: 'Pinicão',
    searchTerm: 'Pinicão',
    logo: '/images/brands/pinicao.webp',
  },
  {
    name: 'Super Safety',
    searchTerm: 'Super Safety',
    logo: '/images/brands/super-safety.jpg',
  },
  {
    name: 'Clarilimp',
    searchTerm: 'Clarilimp',
    logo: '/images/brands/clarilimp.jpg',
  },
  {
    name: 'Claralux',
    searchTerm: 'Claralux',
    logo: '/images/brands/claralux.jpg',
  },
  {
    name: 'Aquafast',
    searchTerm: 'Aquafast',
    logo: '/images/brands/aquafast.jpg',
  },
  {
    name: 'Fiel Papéis',
    searchTerm: 'Fiel Papéis',
    logo: '/images/brands/fiel-papeis.png',
  },
  {
    name: 'Via Aroma',
    searchTerm: 'Via Aroma',
    logo: '/images/brands/via-aroma.png',
  },
];

function buildBrandUrl(searchTerm) {
  return `${NUVEMSHOP_URL}search/?q=${encodeURIComponent(searchTerm)}`;
}

export default function Home() {
  const heroWpp = buildWhatsAppUrl();

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

      {/* MARCAS EM DESTAQUE */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="font-display text-3xl lg:text-5xl text-[#0B2861]">
            Encontre sua marca favorita
          </h2>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-4"
          data-testid="featured-brands-grid"
        >
          {featuredBrands.map((brand, index) => (
            <motion.a
              key={brand.name}
              href={buildBrandUrl(brand.searchTerm)}
              target="_blank"
              rel="noopener noreferrer"
              custom={index}
              variants={brandVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              whileHover={{
                y: -5,
              }}
              data-testid={`brand-${brand.name
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
              aria-label={`Ver produtos da marca ${brand.name}`}
              className="group flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-sky-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
            >
              <div className="flex min-h-[118px] flex-1 items-center justify-center rounded-xl bg-white px-2 py-3">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    loading="lazy"
                    className="max-h-[98px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-[98px] w-full items-center justify-center rounded-xl bg-slate-50">
                    <span className="font-display text-4xl tracking-wide text-[#0B2861]">
                      ZIP
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors duration-300 group-hover:text-[#0EA5E9]">
                  Ver produtos
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}