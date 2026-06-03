import axios from 'axios';

// FORCE A URL PARA TESTAR - depois que funcionar, voltamos para o process.env
const BACKEND_URL = "https://stmm-ao45.onrender.com";

export const API = `${BACKEND_URL}/api;

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
