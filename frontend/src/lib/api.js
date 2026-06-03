import axios from 'axios';

// URL fixa para garantir que o erro de "undefined" suma
const BACKEND_URL = "https://stmm-ao45.onrender.com";

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('API Error:', err.message);
    return Promise.reject(err);
  }
);

// ESSA FUNÇÃO É O QUE O VERCEL ESTÁ RECLAMANDO QUE NÃO EXISTE
export const resolveImg = (url) => {
  if (!url) return '';
  // Se já for uma URL completa, retorna ela
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  
  // Se começar com /, tenta direto no backend
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
  
  // A TENTATIVA MAIS PROVÁVEL: O backend espera /api/files/ + nome do arquivo
  return `${BACKEND_URL}/api/files/${url}`;
};
