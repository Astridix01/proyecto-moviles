import type { ImageSourcePropType } from 'react-native';

export type Product = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  material: string;
  // 👇 Acepta tanto imágenes locales (mock) como URLs (backend)
  imagenes: (ImageSourcePropType | string)[];
};