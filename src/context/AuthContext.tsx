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
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 👇 Agregamos el campo 'role' al usuario quemado.
  // Lo dejamos como 'admin' para que puedas ver la nueva pestaña de inmediato.
  const [user, setUser] = useState<UserProfile | null>({
    username: 'yatzari_demo',
    email: 'demo@yatzari.com',
    first_name: 'Usuario',
    last_name: 'Demo',
    role: 'admin', // 👈 Cambia a 'user' si quieres probar la vista normal
  });

  const login = (userData?: UserProfile) => {
    if (userData) {
      setUser(userData); 
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // 👈 Limpiamos los datos del usuario al salir
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}