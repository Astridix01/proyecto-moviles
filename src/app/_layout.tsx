import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SettingsProvider } from "@/context/SettingsContext";

// 1. Componente interno para manejar la protección de rutas
function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Verificamos si estamos en las pantallas de autenticación
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Si no está logueado y quiere entrar a la app -> Al Login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Si ya está logueado y está en login -> Al Catálogo
      router.replace('/(app)');
    }
  }, [isAuthenticated, segments]);

  // Tu Stack original
  return <Stack screenOptions={{ headerShown: false }} />;
}

// 2. Layout principal que envuelve todo con los Contextos
export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <FavoritesProvider>
          <RootLayoutNav />
        </FavoritesProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}