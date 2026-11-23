import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';
import { setOnAuthFailure } from '@/services/api';

export type UserProfile = {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin' | string;
};

type AuthContextData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // 1) Registrar callback que el interceptor de api.ts invocará cuando
  //    el refresh token falle (backend caído, refresh revocado, etc.).
  useEffect(() => {
    setOnAuthFailure(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
    return () => setOnAuthFailure(null);
  }, []);

  // 2) Recuperar sesión al abrir la app
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await storage.getAccess();
        if (token) {
          const userData = await authService.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('No hay sesión válida o expiró');
        await storage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    await storage.saveTokens(data.access, data.refresh);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const register = async (payload: any) => {
    await authService.register(payload);
    await login(payload.email, payload.password);
  };

  const logout = async () => {
    try {
      const refresh = await storage.getRefresh();
      if (refresh) {
        await authService.logout(refresh);
      }
    } catch (error) {
      console.log('Error al cerrar sesión en backend', error);
    } finally {
      await storage.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    const updatedUser = await authService.updateMe(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}