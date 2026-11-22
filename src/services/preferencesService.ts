import { api } from './api';

export type Theme = 'light' | 'dark' | 'system';

export interface Preferences {
  page_size: number;
  theme: Theme;
}

export const DEFAULT_PREFERENCES: Preferences = {
  page_size: 5,
  theme: 'light',
};

export const preferencesService = {
  async get(): Promise<Preferences> {
    const { data } = await api.get<Preferences>('/preferences/');
    return data;
  },

  async update(patch: Partial<Preferences>): Promise<Preferences> {
    const { data } = await api.patch<Preferences>('/preferences/', patch);
    return data;
  },
};