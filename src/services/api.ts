import { API_URL } from '@/constants/config';
import { storage } from '@/utils/storage';
import axios from 'axios';

let onAuthFailure: (() => void) | null = null;
export const setOnAuthFailure = (cb: (() => void) | null) => { onAuthFailure = cb; };

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const access = await storage.getAccess();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = await storage.getRefresh();
        if (!refresh) throw new Error('No refresh token available');

        const { data } = await axios.post(`${API_URL}/auth/refresh/`, { refresh }, { timeout: 15000 });
        const newAccess = data.access;

        await storage.saveTokens(newAccess, refresh);
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        try { await storage.clearTokens(); } catch { }
        onAuthFailure?.();  
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        if (failedQueue.length) processQueue(new Error('refresh aborted'), null);
      }
    }

    return Promise.reject(error);
  }
);