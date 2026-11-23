import React, { createContext, useState, ReactNode } from 'react';
import { productService, type ProductFormData } from '@/services/productService';
import type { Product } from '@/types/product';

type FetchParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
};

type ProductsContextData = {
  products: Product[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  fetchProducts: (params: FetchParams) => Promise<void>;
  addProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: number, data: ProductFormData) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
};

export const ProductsContext = createContext<ProductsContextData>(
  {} as ProductsContextData
);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (params: FetchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { results, totalCount } = await productService.getAll(params);
      setProducts(results);
      setTotalCount(totalCount);
    } catch (err: any) {
      setError('No se pudieron cargar los productos.');
      console.error('Error fetching products:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (data: ProductFormData) =>
    productService.create(data);

  const updateProduct = async (id: number, data: ProductFormData) =>
    productService.update(id, data);

  const deleteProduct = async (id: number) => {
    await productService.remove(id);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        totalCount,
        isLoading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}