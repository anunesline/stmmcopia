

console.log("URL DO BACKEND:", process.env.REACT_APP_API_URL);

import axios from 'axios';

// Suporta tanto REACT_APP_BACKEND_URL (Emergent) quanto REACT_APP_API_URL (Vercel)
// Defina UMA das duas no painel de variáveis de ambiente.
const BACKEND_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  '';

// Se a URL já termina com /api, usa direto; senão concatena /api
export const API = BACKEND_URL.replace(/\/$/, '') + (BACKEND_URL.endsWith('/api') ? '' : '/api');

if (!BACKEND_URL) {
  // eslint-disable-next-line no-console
  console.error('[MM] Defina REACT_APP_API_URL (ou REACT_APP_BACKEND_URL) no painel de variáveis de ambiente.');
}

export const api = axios.create({
  baseURL: API,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // eslint-disable-next-line no-console
    console.error('[MM API]', err?.config?.url, err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

export const formatBRL = (n) =>
  (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Resolve image URL: data:..., http(s):// → como veio; /api/files/... → prefixa backend
export const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${BACKEND_URL.replace(/\/$/, '')}${url}`;
  return url;
};
