import axios from 'axios';

// URL fixa, mas com fallback para evitar erros de leitura
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
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado para identificar o que exatamente está falhando na Vercel
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
    } else {
      console.error('API Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Resolve caminhos de imagens.
 * Garantimos que o retorno seja sempre uma string válida.
 */
export const resolveImg = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  // Se já for uma URL completa, retorna ela
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // Se começar com /, remove a barra dupla caso já exista no BACKEND_URL
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  // Se o backend espera /api/files/, garantimos esse prefixo
  // Nota: Ajuste se o seu backend mudar a pasta de arquivos
  return `${BACKEND_URL}/api/files${cleanUrl}`;
};
