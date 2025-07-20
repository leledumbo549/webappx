import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom, userAtom } from '@/atoms/loginAtoms';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add authorization header
instance.interceptors.request.use(
  (config) => {
    const store = getDefaultStore();
    const token = store.get(tokenAtom);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        // Clear stored auth data and redirect to login
        const store = getDefaultStore();
        store.set(tokenAtom, null);
        store.set(userAtom, null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.hash = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
export { isAxiosError } from 'axios';
