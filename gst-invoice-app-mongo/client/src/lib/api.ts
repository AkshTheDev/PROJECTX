// client/src/lib/api.ts
import axios from 'axios';

// Prefer env-configured API base for deploy; fallback to reverse proxy path `/api` (works with Nginx proxy)
const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;