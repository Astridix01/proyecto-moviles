import ImageCarousel from "@/components/ImageCarousel";
import ToastCarrito from "@/components/ToastCarrito";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart"; 
import { useSettings } from "@/hooks/useSettings";
import { useProducts } from '@/hooks/useProducts'; // 👈 IMPORTAMOS EL HOOK
import { formatPrice } from "@/utils/formatPrice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Heart, ShoppingBag } from "lucide-react-native"; 
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductoDetalle () {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { esFavorito, toggleFavorito } = useFavorites();
  const { addItem } = useCart(); 
  
  // 👇 Obtenemos los productos y los colores dinámicos
  const { products } = useProducts(); 
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const [showToast, setShowToast] = useState(false);

  // 👇 Buscamos en 'products' en lugar de 'productos'
  const producto = products.find((p) => p.id === Number(id));

  // Si el producto fue eliminado desde el admin, o la ruta es inválida
  if (!producto) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Producto no encontrado</Text>
      </View>
    );
  }

  const handleAgregar = () => {
    addItem(producto);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}> 
        
        {/* Imagen y Botones Flotantes */}
        <View style={styles.imageWrapper}>
          <ImageCarousel imagenes={producto.imagenes} />
          
          <Pressable style={styles.corazon} onPress={() => toggleFavorito(producto.id)}>
            <Heart 
              color={colors.surface2} 
              size={22} 
              fill={esFavorito(producto.id) ? colors.surface2 : 'transparent'}
            />
          </Pressable>

          <Pressable style={styles.atras} onPress={() => router.back()}>
            <ChevronLeft color={colors.text} size={22}/>
          </Pressable>
        </View>

        {/* Información del Producto */}
        <View style={styles.info}>
          
          <Text style={styles.nombre}>{producto.nombre}</Text>
          <Text style={styles.precio}>{formatPrice(producto.precio)}</Text>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{producto.categoria}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{producto.material}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Detalles de la pieza</Text>
          <Text style={styles.descripcion}>{producto.descripcion}</Text>
        </View>

      </ScrollView>

      {/* Footer fijo con botón de compra */}
      <View style={styles.footer}>
        <Pressable style={styles.botonAgregar} onPress={handleAgregar}>
          <ShoppingBag color={colors.white} size={20} />
          <Text style={styles.botonTexto}>Agregar al carrito</Text>
        </Pressable>
      </View>

      <ToastCarrito visible={showToast} productName={producto.nombre} />
    </SafeAreaView>
  );
}

// 👇 Generador de estilos dinámicos (se mantiene igual)
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  imageWrapper: {
    position: 'relative',
  },
  corazon: {
    position: 'absolute',
    top: 20,
    right: 15,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  atras: {
    position: 'absolute',
    top: 20,
    left: 15,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    padding: 20,
  },
  nombre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  precio: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  botonAgregar: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  botonTexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});