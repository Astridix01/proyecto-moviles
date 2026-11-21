import { createContext, useState, ReactNode } from 'react';

export type UserProfile = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin'; // 👈 NUEVO CAMPO
};

type AuthContextData = {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (userData?: UserProfile) => void;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>({
    username: 'yatzari_demo',
    email: 'demo@yatzari.com',
    first_name: 'Usuario',
    last_name: 'Demo',
    role: 'admin', 
  });

  const login = (userData?: UserProfile) => {
    if (userData) {
      setUser(userData); 
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}