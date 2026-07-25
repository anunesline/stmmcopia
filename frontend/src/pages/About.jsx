import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'Entrega rápida',
    text: 'Atendimento em Pinhais, Curitiba e região metropolitana.',
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento próximo',
    text: 'Ajuda de verdade para encontrar o produto que você procura.',
  },
  {
    icon: ShieldCheck,
    title: 'Produtos de qualidade',
    text: 'Marcas reconhecidas para sua casa ou seu negócio.',
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function About() {
  return (
    <main
      className="overflow-hidden bg-white"
      data-testid="about-page"
    >
      {/* Apresentação */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0EA5E9]">
            Sobre a MM
          </p>

          <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight text-[#061844] sm:text-5xl">
            Tudo o que você precisa,
            <span className="block text-[#0EA5E9]">
              em um só lugar.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Produtos de limpeza, papéis, descartáveis e utilidades com
            variedade, qualidade e atendimento próximo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/produtos"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#061844] px-7 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B2861] hover:shadow-lg"
            >
              Ver produtos
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="https://wa.me/554134032999"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-4 font-semibold text-[#061844] transition-all duration-300 hover:border-sky-300 hover:bg-sky-50"
            >
              <MessageCircle className="h-5 w-5" />
              Falar conosco
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="relative pb-7"
        >
          <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-xl shadow-slate-200/70">
            <img
              src="/estoque.webp"
              alt="Corredor da MM Distribuidora com produtos de limpeza"
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div className="absolute bottom-0 left-5 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-xl sm:left-auto sm:right-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-[#0EA5E9]">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xl font-bold text-[#061844]">
                  +500 produtos
                </p>

                <p className="text-sm text-slate-500">
                  para diferentes necessidades
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Diferenciais */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-[#0EA5E9] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-[#061844]">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-3xl bg-[#061844] px-7 py-10 sm:px-10 lg:flex-row lg:items-center"
        >
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Procurando algum produto?
            </h2>

            <p className="mt-2 text-blue-100">
              Veja nossas categorias ou fale diretamente com a equipe.
            </p>
          </div>

          <Link
            to="/produtos"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#061844] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
          >
            Ver produtos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}