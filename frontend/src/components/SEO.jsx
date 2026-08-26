import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://www.mmdistribuidora.com.br';

const SEO_BY_PATH = {
  '/': {
    title: 'Produtos de Limpeza em Pinhais | MM Distribuidora',
    description: 'MM Distribuidora: produtos de limpeza e saneantes em Pinhais, Curitiba e região. Compre online com variedade, atendimento e entrega rápida.',
  },
  '/produtos': {
    title: 'Produtos de Limpeza | MM Distribuidora',
    description: 'Encontre produtos de limpeza, higiene, descartáveis e papéis na MM Distribuidora. Consulte as categorias e compre online.',
  },
  '/sobre': {
    title: 'Sobre a MM Distribuidora | Produtos de Limpeza',
    description: 'Conheça a MM Distribuidora, especializada em produtos de limpeza e saneantes para Pinhais, Curitiba e região.',
  },
  '/contato': {
    title: 'Contato | MM Distribuidora em Pinhais',
    description: 'Fale com a MM Distribuidora em Pinhais. Atendimento para produtos de limpeza, pedidos, informações e entrega na região.',
  },
};

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
    const seo = SEO_BY_PATH[normalizedPath] || SEO_BY_PATH['/'];
    const canonicalUrl = `${BASE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`;

    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' });
  }, [pathname]);

  return null;
}
