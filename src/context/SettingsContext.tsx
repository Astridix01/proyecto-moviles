import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { lightColors, darkColors } from '@/constants/colors';
import {
  DEFAULT_PREFERENCES,
  Theme,
  preferencesService,
} from '@/services/preferencesService';

type SettingsContextData = {
  pageSize: number;
  setPageSize: (n: number) => Promise<void>;
  theme: Theme;
  setTheme: (t: Theme) => Promise<void>;
  colors: typeof lightColors;
  isDark: boolean;
  isLoading: boolean;
};

export const SettingsContext = createContext<SettingsContextData>(
  {} as SettingsContextData
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const systemScheme = useColorScheme();

  const [pageSize, setPageSizeState] = useState<number>(
    DEFAULT_PREFERENCES.page_size
  );
  const [theme, setThemeState] = useState<Theme>(DEFAULT_PREFERENCES.theme);
  const [isLoading, setIsLoading] = useState(true);

  const themeRef = useRef<Theme>(theme);
  const pageSizeRef = useRef<number>(pageSize);
  const isAuthenticatedRef = useRef<boolean>(isAuthenticated);

  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { pageSizeRef.current = pageSize; }, [pageSize]);
  useEffect(() => { isAuthenticatedRef.current = isAuthenticated; }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setThemeState(DEFAULT_PREFERENCES.theme);
      setPageSizeState(DEFAULT_PREFERENCES.page_size);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const prefs = await preferencesService.get();
        if (!cancelled) {
          setThemeState(prefs.theme);
          setPageSizeState(prefs.page_size);
        }
      } catch (error) {
        console.warn(
          '[Settings] No se pudieron cargar las preferencias, usando defaults.',
          error
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isAuthenticated, authLoading]);

  const setTheme = useCallback(async (next: Theme): Promise<void> => {
    const previous = themeRef.current;
    if (previous === next) return;

    setThemeState(next);
    themeRef.current = next;

    if (!isAuthenticatedRef.current) return;

    try {
      await preferencesService.update({ theme: next });
    } catch (error) {
      if (themeRef.current === next) {
        setThemeState(previous);
        themeRef.current = previous;
      }
      throw error;
    }
  }, []);

  const setPageSize = useCallback(async (next: number): Promise<void> => {
    const previous = pageSizeRef.current;
    if (previous === next) return;

    setPageSizeState(next);
    pageSizeRef.current = next;

    if (!isAuthenticatedRef.current) return;

    try {
      await preferencesService.update({ page_size: next });
    } catch (error) {
      if (pageSizeRef.current === next) {
        setPageSizeState(previous);
        pageSizeRef.current = previous;
      }
      throw error;
    }
  }, []);

  const isDark =
    theme === 'dark' || (theme === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <SettingsContext.Provider
      value={{ pageSize, setPageSize, theme, setTheme, colors, isDark, isLoading }}
    >
      {children}
    </SettingsContext.Provider>
  );
}