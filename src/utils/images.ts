import type { ImageSourcePropType } from 'react-native';

/**
 * Normaliza una imagen que puede venir como import local (mock)
 * o como URL string (backend Django).
 */
export const getImageSource = (img: ImageSourcePropType | string): ImageSourcePropType => {
  if (typeof img === 'string') {
    return { uri: img };
  }
  return img;
};