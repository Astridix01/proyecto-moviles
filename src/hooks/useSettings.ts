// src/hooks/useSettings.ts
import { useContext } from 'react';
import { SettingsContext } from '@/context/SettingsContext';

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings debe usarse dentro de SettingsProvider');
  return ctx;
};