import logo from '@/assets/images/joyeria/logo.jpeg';
import ProductCard from "@/components/ProductCard";
import ToastCarrito from "@/components/ToastCarrito";
import { useFavorites } from "@/hooks/useFavorites";
import { useSettings } from "@/hooks/useSettings";
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/product';
import { Heart } from "lucide-react-native";
import { useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favorites() {
  const { favorites } = useFavorites();
  const { colors } = useSettings();
  const { products } = useProducts();
  const styles = createStyles(colors);

  const [showToast, setShowToast] = useState(false);
  const [lastAddedName, setLastAddedName] = useState("");
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleProductAdded = (product: Product) => {
    setLastAddedName(product.name);
    setShowToast(true);

    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }

    toastTimeout.current = setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const favoriteProducts = products.filter((p) =>
    favorites.includes(p.id)
  );

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

      <FlatList
        data={favoriteProducts}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1 }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onAdded={() => handleProductAdded(item)} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Heart color={colors.surface2} size={35} />
            <Text style={{ color: colors.text, marginTop: 8 }}>
              Aún no tienes favoritos
            </Text>
            <Text style={styles.emptyText}>
              Toca el corazón en un producto para guardarlo aquí
            </Text>
          </View>
        }
      />

      <ToastCarrito visible={showToast} productName={lastAddedName} />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20, 
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});