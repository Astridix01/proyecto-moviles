import { ActivityIndicator, View } from 'react-native';
import { Stack, Redirect, useSegments } from "expo-router";
import { AuthProvider} from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { colors } from "@/constants/colors";

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();

  // 👇 Verificamos si estamos dentro del grupo de autenticación
  const inAuthGroup = segments[0] === '(auth)';

  // 👇 Redirecciones declarativas: NO pintan la pantalla equivocada
  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isAuthenticated && inAuthGroup) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <FavoritesProvider>
          <ProductsProvider>
            <CartProvider>
              <RootLayoutNav />
            </CartProvider>
          </ProductsProvider>
        </FavoritesProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}