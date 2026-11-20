import { createContext, ReactNode, useState } from "react";

type FavoritesContextType = {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
export function FavoritesProvider({ children }: { children: ReactNode }) {

  const [favoritos, setFavoritos] = useState<number[]>([]);
  const esFavorito = (id: number) => favoritos.includes(id);
  const toggleFavorito = (id: number) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((f) => f !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites: favoritos, toggleFavorite: toggleFavorito, isFavorite: esFavorito }}>
      {children}
    </FavoritesContext.Provider>

  );
}
