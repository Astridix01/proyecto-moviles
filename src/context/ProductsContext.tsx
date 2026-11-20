import { products as mockProductos } from '@/mocks/products';
import type { Product } from '@/types/product';
import { createContext, ReactNode, useState } from 'react';

type ProductsContextData = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updatedProduct: Product) => void;
  deleteProduct: (id: number) => void;
};

export const ProductsContext = createContext<ProductsContextData>({} as ProductsContextData);

export function ProductsProvider({ children }: { children: ReactNode }) {
  // Inicializamos con tus datos mock
  const [products, setProducts] = useState<Product[]>(mockProductos);

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = Math.max(...products.map(p => p.id), 0) + 1; // Generamos un ID falso
    setProducts([...products, { ...newProduct, id }]);
  };

  const updateProduct = (id: number, updated: Product) => {
    setProducts(products.map(p => p.id === id ? updated : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}