import axios from 'axios';
import { decodeToken } from '../utils/jwt.utils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      decodeToken(token);
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Prevent redirect loop/refresh if already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
