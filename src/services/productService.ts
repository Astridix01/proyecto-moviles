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

type ProductPayload = {
  name: string;
  price: string;
  description: string;
  category: string;
  material: string;
  imageUri: string | null;
};

export const mapProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.nombre,
  price: apiProduct.precio,
  description: apiProduct.descripcion,
  category: apiProduct.categoria,
  material: apiProduct.material,
  images: apiProduct.imagenes,
  active: apiProduct.activo,
});

const isLocalFile = (uri: string) =>
  uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('ph://');

const buildFormData = (data: ProductPayload): FormData => {
  const formData = new FormData();
  formData.append('nombre', data.name);
  formData.append('precio', data.price);
  formData.append('descripcion', data.description);
  formData.append('categoria', data.category);
  formData.append('material', data.material);

  // Solo enviamos imagen si es un archivo local (el usuario eligió una nueva)
  if (data.imageUri && isLocalFile(data.imageUri)) {
    const filename = data.imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('imagen', {
      uri: data.imageUri,
      name: filename,
      type,
    } as any);
  }

  return formData;
};

export const productService = {
  getAll: async (params: { page?: number; pageSize?: number; search?: string; category?: string }) => {
    const queryParams: any = { page: params.page, page_size: params.pageSize };
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

  create: async (data: ProductPayload): Promise<Product> => {
    const formData = buildFormData(data);
    const response = await api.post('/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProduct(response.data);
  },

  update: async (id: number, data: ProductPayload): Promise<Product> => {
    const formData = buildFormData(data);
    const response = await api.put(`/products/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProduct(response.data);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}/`);
  },
};