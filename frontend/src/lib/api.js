import axios from 'axios';

const BASE_URL = "https://stmm-ao45.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Remove a duplicação na hora da requisição caso aconteça
  config.url = config.url.replace(/\/api\/api/g, '/api');
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const resolveImg = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('http')) return url;
  
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  // Garantimos que o caminho de arquivos não duplique o /api
  return `https://stmm-ao45.onrender.com/api/files${cleanUrl}`.replace(/\/api\/api/g, '/api');
};