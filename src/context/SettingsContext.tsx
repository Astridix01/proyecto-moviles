// src/context/SettingsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { lightColors, darkColors } from '@/constants/colors';

type Theme = 'light' | 'dark';

type SettingsContextData = {
  pageSize: number;
  setPageSize: (n: number) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  colors: typeof lightColors; // 👈 colores activos
  isDark: boolean;
};

export const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [pageSize, setPageSize] = useState(6);
  const [theme, setTheme] = useState<Theme>('light');

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <SettingsContext.Provider
      value={{ pageSize, setPageSize, theme, setTheme, colors, isDark }}
    >
      {children}
    </SettingsContext.Provider>
  );
}