import type { ImageSourcePropType } from 'react-native';

export type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  material: string;
  images: (ImageSourcePropType | string)[];
  active: boolean;
};