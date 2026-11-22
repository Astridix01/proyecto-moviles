import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/types/product';

type FavoritesContextData = {
  favoriteIds: number[];
  favoriteProducts: Product[];
  isLoading: boolean;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (productId: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await favoriteService.getAll();
      setFavoriteIds(data.productIds);
      setFavoriteProducts(data.products);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar favoritos al autenticarse; vaciar al cerrar sesión
  useEffect(() => {
    if (isAuthenticated) {
      refreshFavorites();
    } else {
      setFavoriteIds([]);
      setFavoriteProducts([]);
    }
  }, [isAuthenticated]);

  const isFavorite = (productId: number) => favoriteIds.includes(productId);

  const toggleFavorite = async (productId: number) => {
    const wasFavorite = favoriteIds.includes(productId);

    // Optimistic update: cambia el corazón al instante
    if (wasFavorite) {
      setFavoriteIds((prev) => prev.filter((id) => id !== productId));
      setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      setFavoriteIds((prev) => [...prev, productId]);
    }

    try {
      if (wasFavorite) {
        await favoriteService.remove(productId);
      } else {
        await favoriteService.add(productId);
      }
      // Refrescamos para traer el producto completo si se agregó
      await refreshFavorites();
    } catch (error) {
      // Revertimos en caso de error
      if (wasFavorite) {
        setFavoriteIds((prev) => [...prev, productId]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== productId));
      }
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteProducts,
        isLoading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}