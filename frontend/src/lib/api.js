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

// Apenas para logar erros, sem afetar o fluxo
api.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('[MM API Error]:', err.message);
    return Promise.reject(err);
  }
);
