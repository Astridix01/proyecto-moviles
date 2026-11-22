// src/constants/colors.ts

export const lightColors = {
  primary: '#FFFFFF',
  primaryDark: '#8985BC',
  background: '#F8F4EE',
  backgroundDisabled: '#F0EDE7',
  surface: '#EFE9DE',
  surface2: '#E57373',
  text: '#453D33',
  textSecondary: '#7A7166',
  accent: '#B8935A',
  error: '#B85C5C',
  white: '#FFFFFF',
  lavender: '#B3AEDD',
  lavenderDeep: '#8985BC',
  lavenderDark: '#4E4A78',
  sage: '#9CAE93',
  sageDark: '#4C5A46',
  gold: '#B8935A',
  danger: '#B85C5C',
};

export const darkColors = {
  primary: '#2A2740',        // tarjetas: lavanda muy oscuro
  primaryDark: '#B3AEDD',    // botones: lavanda claro (contraste)
  background: '#1A1826',     // fondo general: casi negro con tinte lavanda
  surface: '#2E2A4A',        // superficies: lavanda profundo
  surface2: '#E57373',
  text: '#F8F4EE',           // texto claro
  textSecondary: '#B3AEDD',  // texto secundario lavanda suave
  accent: '#D4B07A',         // dorado más luminoso para oscuro
  error: '#E07A7A',
  white: '#FFFFFF',
  lavender: '#B3AEDD',
  lavenderDeep: '#8985BC',
  lavenderDark: '#4E4A78',
  sage: '#9CAE93',
  sageDark: '#4C5A46',
  gold: '#D4B07A',
  danger: '#E07A7A',
};

// Por compatibilidad (si algún componente aún importa `colors` directo)
export const colors = lightColors;