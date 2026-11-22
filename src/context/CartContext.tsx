import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { cartService, CartItem } from '@/services/cartService';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/types/product';

type CartContextData = {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    setIsLoading(true);
    try {
      const cart = await cartService.get();
      setItems(cart.items);
      setTotalItems(cart.totalItems);
      setTotalPrice(parseFloat(cart.totalPrice) || 0);
    } catch (error) {
      console.error('Error cargando carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar carrito cuando el usuario se autentica; vaciar al cerrar sesión
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
    }
  }, [isAuthenticated]);

  const addItem = async (product: Product) => {
    try {
      const cart = await cartService.addItem(product.id, 1);
      setItems(cart.items);
      setTotalItems(cart.totalItems);
      setTotalPrice(parseFloat(cart.totalPrice) || 0);
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const cart = await cartService.updateItem(itemId, quantity);
      setItems(cart.items);
      setTotalItems(cart.totalItems);
      setTotalPrice(parseFloat(cart.totalPrice) || 0);
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartService.removeItem(itemId);
      await refreshCart();
    } catch (error) {
      console.error('Error eliminando item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clear();
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error vaciando carrito:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        totalItems,
        totalPrice,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}