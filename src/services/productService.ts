// src/services/productService.ts
import { api } from './api';
import type { Product } from '@/types/product';

type ApiProduct = {
  id: number;
  nombre: string;
  precio: string;
  descripcion: string;
  categoria: string;
  material: string;
  imagenes: string[];
  activo: boolean;
};

const mapProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.nombre,
  price: apiProduct.precio,
  description: apiProduct.descripcion,
  category: apiProduct.categoria,
  material: apiProduct.material,
  images: apiProduct.imagenes,
  active: apiProduct.activo,
});

export const productService = {
  getAll: async (params: { page?: number; pageSize?: number; search?: string; category?: string }) => {
    // Construimos los query params dinámicamente
    const queryParams: any = {
      page: params.page,
      page_size: params.pageSize,
    };

    if (params.search) queryParams.search = params.search;
    if (params.category && params.category !== 'todos') queryParams.category = params.category;

    const response = await api.get('/products/', { params: queryParams });
    
    return {
      results: response.data.results.map(mapProduct),
      totalCount: response.data.count,
    };
  },

  getById: async (id: number) => {
    const response = await api.get(`/products/${id}/`);
    return mapProduct(response.data);
  },
};