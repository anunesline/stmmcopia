import axios from 'axios';

// URL fixa, sem risco de ser undefined
const API_URL = "https://stmm-ao45.onrender.com/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Apenas log de erro simplificado
api.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('API Error:', err.message);
    return Promise.reject(err);
  }
);
