import ImageCarousel from "@/components/ImageCarousel";
import ToastCarrito from "@/components/ToastCarrito";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from "@/hooks/useSettings";
import { formatPrice } from "@/utils/formatPrice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Heart, ShoppingBag } from "lucide-react-native";
import { useState, useEffect } from "react";
import { productService } from '@/services/productService';
import {
  Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/types/product";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const { products } = useProducts();
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // 👇 TODOS los hooks arriba, antes de cualquier return
  useEffect(() => {
    const loadProduct = async () => {
      const found = products.find((p) => p.id === Number(id));
      if (found) {
        setProduct(found);
        setLoading(false);
        return;
      }
      try {
        const fetched = await productService.getById(Number(id));
        setProduct(fetched);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, products]);

  // 👇 Returns condicionales DESPUÉS de todos los hooks
  if (loading) {
    return (
      <View style={styles.notFoundContainer}>
        <ActivityIndicator color={colors.primaryDark} size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Producto no encontrado</Text>
      </View>
    );
  }

  const handleAgregar = () => {
    addItem(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <ImageCarousel imagenes={product.images} />

          <Pressable style={styles.hearth} onPress={() => toggleFavorite(product.id)}>
            <Heart
              color={colors.surface2}
              size={22}
              fill={isFavorite(product.id) ? colors.surface2 : 'transparent'}
            />
          </Pressable>

          <Pressable style={styles.behind} onPress={() => router.back()}>
            <ChevronLeft color={colors.text} size={22} />
          </Pressable>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{product.category}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{product.material}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Detalles de la pieza</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={handleAgregar}>
          <ShoppingBag color={colors.white} size={20} />
          <Text style={styles.textButton}>Agregar al carrito</Text>
        </Pressable>
      </View>

      <ToastCarrito visible={showToast} productName={product.name} />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 110 },
  notFoundContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background,
  },
  notFoundText: { fontSize: 18, color: colors.textSecondary },
  imageWrapper: { position: 'relative' },
  hearth: {
    position: 'absolute', top: 20, right: 15,
    backgroundColor: colors.surface, borderRadius: 20, padding: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  behind: {
    position: 'absolute', top: 20, left: 15,
    backgroundColor: colors.surface, borderRadius: 20, padding: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  info: { padding: 20 },
  name: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  price: { fontSize: 24, fontWeight: '700', color: colors.primaryDark, marginBottom: 16 },
  tagsContainer: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 20 },
  tag: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: colors.surface, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: colors.surface,
  },
  addButton: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 56, borderRadius: 12, gap: 8,
    shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  textButton: { color: colors.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
});