import { api } from './api';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { Product, ProductImageInfo } from '@/types/product';

type ApiProduct = {
  id: number;
  nombre: string;
  precio: string;
  descripcion: string;
  categoria: string;
  material: string;
  imagenes: string[];
  imagenes_info?: ProductImageInfo[];
  activo: boolean;
};

export type GalleryItem =
  | { kind: 'existing'; info: ProductImageInfo }
  | { kind: 'new'; asset: ImagePickerAsset };

export type ProductFormData = {
  name: string;
  price: string;
  description: string;
  category: string;
  material: string;
  gallery: GalleryItem[];
  deletedIds: number[];
};

export const mapProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.nombre,
  price: p.precio,
  description: p.descripcion,
  category: p.categoria,
  material: p.material,
  images: p.imagenes,
  imagesInfo: p.imagenes_info,
  active: p.activo,
});

const toFormFile = (asset: ImagePickerAsset) => {
  const name = asset.fileName ?? `image-${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(name);
  const type = asset.mimeType ?? (match ? `image/${match[1]}` : 'image/jpeg');
  return { uri: asset.uri, name, type } as any;
};

const extractNew = (gallery: GalleryItem[]): ImagePickerAsset[] =>
  gallery
    .filter((g): g is Extract<GalleryItem, { kind: 'new' }> => g.kind === 'new')
    .map((g) => g.asset);

const buildMetadataFormData = (p: ProductFormData): FormData => {
  const fd = new FormData();
  fd.append('nombre', p.name);
  fd.append('precio', p.price);
  fd.append('descripcion', p.description);
  fd.append('categoria', p.category);
  fd.append('material', p.material);
  return fd;
};

export const productService = {
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
  }) => {
    const queryParams: any = { page: params.page, page_size: params.pageSize };
    if (params.search) queryParams.search = params.search;
    if (params.category && params.category !== 'todos') {
      queryParams.category = params.category;
    }
    const response = await api.get('/products/', { params: queryParams });
    return {
      results: response.data.results.map(mapProduct),
      totalCount: response.data.count,
    };
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}/`);
    return mapProduct(response.data);
  },

  create: async (payload: ProductFormData): Promise<Product> => {
    const fd = buildMetadataFormData(payload);
    extractNew(payload.gallery).forEach((asset) =>
      fd.append('imagenes', toFormFile(asset))
    );
    const response = await api.post('/products/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProduct(response.data);
  },

  update: async (id: number, payload: ProductFormData): Promise<Product> => {
    // 1) Borrar las imágenes marcadas
    if (payload.deletedIds.length > 0) {
      await Promise.all(
        payload.deletedIds.map((imgId) =>
          api.delete(`/products/${id}/images/${imgId}/`)
        )
      );
    }

    // 2) Añadir las nuevas
    if (extractNew(payload.gallery).length > 0) {
      const fd = new FormData();
      extractNew(payload.gallery).forEach((asset) =>
        fd.append('imagenes', toFormFile(asset))
      );
      await api.post(`/products/${id}/images/`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    // 3) Reordenar si es necesario
    const fresh = await api.get(`/products/${id}/`);
    const currentInfo: ProductImageInfo[] = fresh.data.imagenes_info ?? [];

    const existingIdsInGallery = new Set(
      payload.gallery
        .filter((g): g is Extract<GalleryItem, { kind: 'existing' }> =>
          g.kind === 'existing'
        )
        .map((g) => g.info.id)
    );

    const newIds = currentInfo
      .map((i) => i.id)
      .filter((iid) => !existingIdsInGallery.has(iid));

    let newIdx = 0;
    const desiredOrder = payload.gallery.map((g) => {
      if (g.kind === 'existing') return g.info.id;
      return newIds[newIdx++];
    });

    const currentOrder = currentInfo.map((i) => i.id);
    if (JSON.stringify(currentOrder) !== JSON.stringify(desiredOrder)) {
      await api.put(`/products/${id}/images/order/`, { order: desiredOrder });
    }

    // 4) Actualizar metadata (JSON, sin tocar imágenes)
    await api.patch(`/products/${id}/`, {
      nombre: payload.name,
      precio: payload.price,
      descripcion: payload.description,
      categoria: payload.category,
      material: payload.material,
    });

    // 5) Devolver la versión final
    const final = await api.get(`/products/${id}/`);
    return mapProduct(final.data);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}/`);
  },
};