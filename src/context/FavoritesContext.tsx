import { createContext, ReactNode, useState } from "react";

type FavoritesContextType = {
  favoritos: number[];
  toggleFavorito: (id: number) => void;
  esFavorito: (id: number) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
export function FavoritesProvider({ children }: { children: ReactNode }) {
  
    const [favoritos, setFavoritos] = useState<number[]>([]);
    const esFavorito = (id: number) => favoritos.includes(id) ;
    const toggleFavorito = (id: number) => { 
        if (favoritos.includes(id)){
            setFavoritos(favoritos.filter((f) => f !== id)); 
        } else {
            setFavoritos([...favoritos, id]);
        }
};    

  return (
    <FavoritesContext.Provider value={{ favoritos, toggleFavorito, esFavorito }}>
    {children}
    </FavoritesContext.Provider>

  );
}
