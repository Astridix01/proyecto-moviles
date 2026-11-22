import { api } from './api';
import type { Product } from '@/types/product';

export type ApiCartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    nombre: string;
    precio: string;
    imagenes: string[];
  };
};

export type ApiCart = {
  items: ApiCartItem[];
  total_items: number;
  total_price: string;
};

export type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: string;
};

const mapCartItem = (apiItem: ApiCartItem): CartItem => ({
  id: apiItem.id,
  quantity: apiItem.quantity,
  product: {
    id: apiItem.product.id,
    name: apiItem.product.nombre,
    price: apiItem.product.precio,
    description: '',
    category: '',
    material: '',
    images: apiItem.product.imagenes,
    active: true,
  },
});

const mapCart = (apiCart: ApiCart): Cart => ({
  items: apiCart.items.map(mapCartItem),
  totalItems: apiCart.total_items,
  totalPrice: apiCart.total_price,
});

export const cartService = {
  get: async (): Promise<Cart> => {
    const response = await api.get('/cart/');
    return mapCart(response.data);
  },

  addItem: async (productId: number, quantity = 1): Promise<Cart> => {
    const response = await api.post('/cart/items/', {
      product_id: productId,
      quantity,
    });
    return mapCart(response.data);
  },

  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/items/${itemId}/`, { quantity });
    return mapCart(response.data);
  },

  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/cart/items/${itemId}/`);
  },

  clear: async (): Promise<void> => {
    await api.delete('/cart/');
  },
};