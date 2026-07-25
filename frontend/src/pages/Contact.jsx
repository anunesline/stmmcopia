import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
} from 'lucide-react';

import { buildWhatsAppUrl } from '../components/WhatsAppWidget';
import { SITE } from '../config/site';
const contactCards = [
  {
    icon: Phone,
    label: 'Telefone e WhatsApp',
    title: SITE.telefone,
    content: (
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Fale diretamente com nossa equipe.
      </p>
    ),
  },
  {
    icon: MapPin,
    label: 'Endereço',
    title: SITE.endereco.rua,
    content: (
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {`${SITE.endereco.bairro} · ${SITE.endereco.cidade} — ${SITE.endereco.estado}`}
      </p>
    ),
  },
  {
    icon: Clock,
    label: 'Horário',
    content: (
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-lg font-bold text-[#061844]">
            Segunda a quinta
          </p>

          <p className="mt-1 text-sm text-slate-600">
            9h às 18h
          </p>
        </div>

        <div>
          <p className="text-lg font-bold text-[#061844]">
            Sexta e sábado
          </p>

          <p className="mt-1 text-sm text-slate-600">
            9h às 13h
          </p>
        </div>
      </div>
    ),
  },
];

const socialNetworks = [
  {
    icon: Instagram,
    name: 'Instagram',
    username: '@redemmdistribuidoras',
    href: SITE.instagram,
    testId: 'contact-instagram',
    external: true,
  },
  {
    icon: Facebook,
    name: 'Facebook',
    username: 'Rede MM Distribuidoras',
   href: SITE.facebook,
    testId: 'contact-facebook',
    external: true,
  },
  {
    icon: Music2,
    name: 'TikTok',
    username: 'Em breve',
    href: SITE.tiktok || null,
    testId: 'contact-tiktok',
    external: false,
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

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Contact() {
  

  const whatsappUrl = buildWhatsAppUrl({
  number: SITE.whatsapp,
});

  const mapsUrl = SITE.maps.rota;
  const mapsEmbedUrl = SITE.maps.embed;
  return (
    <main
      className="overflow-hidden bg-white"
      data-testid="contact-page"
    >
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-bold uppercase tracking-[0.2em] text-[#0EA5E9]"
            >
              Fale com a MM
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight text-[#061844] sm:text-5xl"
            >
              Como podemos
              <span className="block text-[#0EA5E9]">
                ajudar você?
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
            >
              Tire dúvidas, consulte produtos, valores e disponibilidade
              diretamente com nossa equipe.
            </motion.p>

            <motion.a
              variants={fadeUp}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-wpp-btn"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1ebe57] hover:shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              Falar no WhatsApp
            </motion.a>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            className="relative"
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-100 to-blue-50" />

            <div className="overflow-hidden rounded-3xl border border-white bg-slate-100 shadow-xl shadow-slate-200/70">
              <img
                src="/fachada.webp"
                alt="Fachada da MM Distribuidora em Pinhais"
                className="h-[340px] w-full object-cover sm:h-[410px]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Informações */}
      <section className="border-y border-slate-100 bg-slate-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={staggerContainer}
          className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8"
        >
          {contactCards.map((item) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                variants={fadeUp}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-[#0EA5E9] transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#0EA5E9]">
                  {item.label}
                </p>

                {item.title && (
                  <h2 className="mt-2 text-lg font-bold text-[#061844]">
                    {item.title}
                  </h2>
                )}

                {item.content}
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* Fachada */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.55,
            ease: 'easeOut',
          }}
          className="relative min-h-[390px] overflow-hidden rounded-3xl bg-[#061844]"
        >
          <img
            src="/fachada.webp"
            alt="Loja física da MM Distribuidora"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#061844]/95 via-[#061844]/75 to-[#061844]/15" />

          <div className="relative flex min-h-[390px] max-w-xl flex-col justify-center p-8 sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
              <MapPin className="h-6 w-6" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Estamos em Pinhais
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Venha conhecer nossa loja.
            </h2>

            <p className="mt-5 leading-7 text-blue-100">
              Rua Rio Trombetas, 493, Weissópolis. Encontre variedade em
              produtos de limpeza, papéis, descartáveis e utilidades.
            </p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="open-maps-btn"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#061844] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
            >
              Traçar rota
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Mapa */}
      <section
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
        data-testid="map-section"
      >
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0EA5E9]">
              Nossa localização
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-[#061844] sm:text-4xl">
              Como chegar
            </h2>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-[#061844] transition-all duration-300 hover:border-sky-300 hover:bg-sky-50"
          >
            <MapPin className="h-5 w-5" />
            Abrir no Google Maps
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <iframe
            data-testid="google-map"
            title="MM Comércio e Distribuidora — Rua Rio Trombetas, 493, Pinhais — PR"
            src={mapsEmbedUrl}
            width="100%"
            height="300"
            style={{
              border: 0,
              display: 'block',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Redes sociais */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0EA5E9]">
              Redes sociais
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold text-[#061844]">
              Acompanhe a MM
            </h2>

            <p className="mt-3 text-slate-600">
              Novidades, produtos e dicas para facilitar sua rotina.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={staggerContainer}
            className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {socialNetworks.map((social) => {
              const Icon = social.icon;

              const cardContent = (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-[#0EA5E9] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#061844]">
                      {social.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {social.username}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#0EA5E9]">
                    {social.external ? 'Acessar perfil' : 'Perfil em criação'}

                    {social.external && (
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </div>
                </>
              );

              if (!social.href) {
                return (
                  <motion.div
                    key={social.name}
                    variants={fadeUp}
                    data-testid={social.testId}
                    className="group rounded-2xl border border-slate-200 bg-white p-7"
                  >
                    {cardContent}
                  </motion.div>
                );
              }

              return (
                <motion.a
                  key={social.name}
                  variants={fadeUp}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={social.testId}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
                >
                  {cardContent}
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>
    </main>
  );
}