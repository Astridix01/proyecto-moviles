import { api } from './api';
import type { UserProfile } from '@/context/AuthContext';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  },

  register: async (payload: any) => {
    const response = await api.post('/auth/register/', payload);
    return response.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  logout: async (refresh: string) => {
    await api.post('/auth/logout/', { refresh });
  },

  updateMe: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    // El backend solo acepta email, first_name y last_name
    const payload = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    };
    const response = await api.patch('/auth/me/', payload);
    return response.data;
  },
};