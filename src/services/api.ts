import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[FRONT] Axios baseURL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API] Token enviado:', token.substring(0, 20) + '...');
    } else {
      console.log('[API] Nenhum token encontrado');
    }
  }
  console.log('[API] Requisição para:', config.method?.toUpperCase(), config.url);
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirecionamento baseado na página atual
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin') || currentPath.includes('/adminpage')) {
          window.location.href = '/auth/login-admin';
        } else if (currentPath.includes('/supplier') || currentPath.includes('/properties')) {
          window.location.href = '/auth/login-supplier';
        } else {
          window.location.href = '/auth/login-user';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api; 