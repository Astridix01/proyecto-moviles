import { createContext, useState, useContext, ReactNode } from 'react';

// Definimos lo que va a tener nuestro contexto
type AuthContextData = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado falso: inicia en false para que siempre pida login al abrir
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // Aquí luego conectarás con tu API real
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);