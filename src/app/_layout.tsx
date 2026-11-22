import { ActivityIndicator, View } from 'react-native';
import { Stack, Redirect, useSegments } from "expo-router";
import { AuthProvider} from "@/context/AuthContext";
import { useAuth } from '@/hooks/useAuth';
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { useSettings } from '@/hooks/useSettings';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useSettings();
  const segments = useSegments();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  const inAuthGroup = segments[0] === '(auth)';

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