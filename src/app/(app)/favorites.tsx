import logo from '@/assets/images/joyeria/logo.jpeg';
import ProductCard from '@/components/ProductCard';
import ToastCarrito from '@/components/ToastCarrito';
import { useFavorites } from '@/hooks/useFavorites';
import { useSettings } from '@/hooks/useSettings';
import type { Product } from '@/types/product';
import { router, useFocusEffect } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, Image, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Favorites() {
  const { favoriteProducts, isLoading, refreshFavorites } = useFavorites();
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const [showToast, setShowToast] = useState(false);
  const [lastAddedName, setLastAddedName] = useState('');
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refresca al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [])
  );

  const handleProductAdded = (product: Product) => {
    setLastAddedName(product.name);
    setShowToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.bar}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Image source={logo} style={styles.image} resizeMode="cover" />
          </View>
          <Text style={styles.logoText}>Yatzari</Text>
        </View>
      </View>

      {isLoading && favoriteProducts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1 }}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard product={item} onAdded={() => handleProductAdded(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Heart color={colors.surface2} size={64} />
              <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
              <Text style={styles.emptySubtitle}>
                Parece que aún no has guardado ninguna pieza.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.primaryButtonText}>Explorar el catálogo</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <ToastCarrito visible={showToast} productName={lastAddedName} />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width: '100%', height: '100%', borderRadius: 20 },
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  logoText: { fontSize: 20, fontWeight: '700', color: colors.text, letterSpacing: 1.5, textTransform: 'uppercase' },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 40,
  },
  emptyTitle: {
    fontSize: 22, fontWeight: 'bold', color: colors.text,
    marginTop: 20, marginBottom: 8, textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16, color: colors.textSecondary,
    textAlign: 'center', marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 30, paddingVertical: 14, borderRadius: 12,
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});