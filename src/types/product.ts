import type { ImageSourcePropType } from 'react-native';

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  material: string;
  imagenes: ImageSourcePropType[]; // antes: string[]
}