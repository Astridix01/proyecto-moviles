import { api } from './api';
import { mapProduct } from './productService';
import type { Product } from '@/types/product';

type ApiFavoriteResponse = {
  product_ids: number[];
  favorites: any[];
};

export type FavoritesData = {
  productIds: number[];
  products: Product[];
};

export const favoriteService = {
  getAll: async (): Promise<FavoritesData> => {
    const response = await api.get<ApiFavoriteResponse>('/favorites/');
    return {
      productIds: response.data.product_ids,
      products: response.data.favorites.map(mapProduct),
    };
  },

  add: async (productId: number): Promise<void> => {
    await api.post('/favorites/', { product_id: productId });
  },

  remove: async (productId: number): Promise<void> => {
    await api.delete(`/favorites/${productId}/`);
  },
};