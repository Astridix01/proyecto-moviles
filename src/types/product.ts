import type { ImageSourcePropType } from 'react-native';

export type ProductImageInfo = {
  id: number;
  url: string;
  position: number;
};

export type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  material: string;
  images: (ImageSourcePropType | string)[];
  imagesInfo?: ProductImageInfo[];
  active: boolean;
};