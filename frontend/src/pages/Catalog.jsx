import React from 'react';
import { motion } from 'framer-motion';
import {
  Armchair,
  BriefcaseMedical,
  BrushCleaning,
  ChevronRight,
  Droplets,
  Flower2,
  PackageOpen,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  SprayCan,
} from 'lucide-react';

const NUVEMSHOP_URL =
  'https://mmdistribuidoradelimpeza.lojavirtualnuvem.com.br/';

const categories = [
  {
    name: 'Papéis',
    searchTerm: 'papel',
    icon: PackageOpen,
  },
  {
    name: 'Limpeza',
    searchTerm: 'limpeza',
    icon: Sparkles,
  },
  {
    name: 'Descartáveis',
    searchTerm: 'descartáveis',
    icon: ShoppingCart,
  },
  {
    name: 'Higiene',
    searchTerm: 'higiene',
    icon: Droplets,
  },
  {
    name: 'Aromatização',
    searchTerm: 'aromatização',
    icon: Flower2,
  },
  {
    name: 'EPIs',
    searchTerm: 'EPI',
    icon: ShieldCheck,
  },
  {
    name: 'Equipamentos',
    searchTerm: 'equipamentos de limpeza',
    icon: BrushCleaning,
  },
  {
    name: 'Sacos para lixo',
    searchTerm: 'saco para lixo',
    icon: BriefcaseMedical,
  },
  {
    name: 'Dispensers',
    searchTerm: 'dispenser',
    icon: SprayCan,
  },
  {
    name: 'Utilidades',
    searchTerm: 'utilidades',
    icon: Armchair,
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function buildCategoryUrl(searchTerm) {
  return `${NUVEMSHOP_URL}search/?q=${encodeURIComponent(searchTerm)}`;
}

export default function Catalog() {
  return (
    <div data-testid="catalog-page">
      {/* CABEÇALHO */}
      <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-8 lg:pt-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center"
        >
          <h1 className="font-display text-3xl text-[#0B2861] lg:text-4xl">
            O que você{' '}
            <span className="text-[#0EA5E9]">
              procura?
            </span>
          </h1>
        </motion.div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 lg:px-8 lg:pb-16 lg:pt-9">
        <div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          data-testid="catalog-categories-grid"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.a
                key={category.name}
                href={buildCategoryUrl(category.searchTerm)}
                target="_blank"
                rel="noopener noreferrer"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                whileHover={{
                  y: -6,
                }}
                aria-label={`Ver produtos da categoria ${category.name}`}
                className="group flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-sky-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-[#0B2861] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0EA5E9] group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <div className="mt-7">
                  <h2 className="font-display text-xl leading-tight text-[#0B2861]">
                    {category.name}
                  </h2>

                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors duration-300 group-hover:text-[#0EA5E9]">
                    Ver produtos

                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-4 mb-14 overflow-hidden rounded-3xl bg-sky-50 lg:mx-auto lg:max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-5 px-6 py-8 sm:px-10 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-3xl text-[#0B2861]">
              Não encontrou o que procura?
            </h2>

            <p className="mt-2 text-slate-600">
              Confira todos os produtos disponíveis em nossa loja online.
            </p>
          </div>

          <a
            href={NUVEMSHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#0B2861] transition-colors hover:text-[#0EA5E9]"
          >
            Ver todos os produtos

            <ChevronRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}