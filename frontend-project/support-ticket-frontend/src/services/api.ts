// src/services/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore'; // We'll create this store

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling (e.g., 401 for logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized (and not on login page, to avoid loop), log out user
      // This check can be more sophisticated
      if (!window.location.pathname.includes('/login')) {
        useAuthStore.getState().logout();
        // window.location.href = '/login'; // Force redirect
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
