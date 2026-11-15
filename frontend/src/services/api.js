import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Access Token
api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('agriride_tokens') || '{}');
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = JSON.parse(localStorage.getItem('agriride_tokens') || '{}');

      if (tokens?.refresh) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: tokens.refresh,
          });

          if (res.data?.access) {
            tokens.access = res.data.access;
            localStorage.setItem('agriride_tokens', JSON.stringify(tokens));
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token expired or revoked
          localStorage.removeItem('agriride_tokens');
          localStorage.removeItem('agriride_user');
          window.dispatchEvent(new Event('auth:logout'));
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
