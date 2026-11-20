import type { ImageSourcePropType } from 'react-native';

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  material: string;
  // 👇 Acepta tanto imágenes locales (mock) como URLs (backend)
  images: (ImageSourcePropType | string)[];
};