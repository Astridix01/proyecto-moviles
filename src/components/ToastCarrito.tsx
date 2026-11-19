import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type Props = {
  visible: boolean;
  productName: string;
};

export default function ToastCarrito({ visible, productName }: Props) {
  // Valores animados
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Animación de entrada (fade in + pop)
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)), // Efecto rebote
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animación de salida (fade out)
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  // Si no está visible (y la animación terminó), no renderizamos nada para no estorbar
  if (!visible) {
    // NOTA: En una app real podrías usar un estado extra para desmontar, 
    // pero para que la animación de salida se vea, dejamos que se renderice con opacidad 0.
  }

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.toast, { opacity, transform: [{ scale }] }]}>
        <View style={styles.iconContainer}>
          <Check color={colors.white} size={28} strokeWidth={3} />
        </View>
        <Text style={styles.title}>¡Añadido!</Text>
        <Text style={styles.message} numberOfLines={2}>
          {productName} está en tu carrito
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill, // Cubre toda la pantalla
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Se asegura de estar por encima de todo
  },
  toast: {
    backgroundColor: colors.surface, // Tu color crema
    paddingHorizontal: 30,
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '70%',
    maxWidth: 280,
    // Sombra para que "flote"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.white,
  },
  iconContainer: {
    backgroundColor: colors.sageDark, // Un verde oliva de tu paleta
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.sageDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});