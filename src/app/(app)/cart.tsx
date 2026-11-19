import { useCart } from '@/hooks/useCart';
import { useSettings } from '@/hooks/useSettings';
import { formatPrice } from '@/utils/formatPrice';
import { getImageSource } from '@/utils/images';
import { router } from 'expo-router';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  
  const { colors } = useSettings();
  const styles = createStyles(colors);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <ShoppingBag color={colors.textSecondary} size={64} />
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>Parece que aún no has agregado nada.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/')}>
          <Text style={styles.primaryButtonText}>Ir al catálogo</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Carrito</Text>
      </View>

      {/* 👇 La FlatList ahora ocupa todo el espacio disponible */}
      <FlatList
        data={items}
        style={{ flex: 1 }} 
        keyExtractor={(item) => String(item.product.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image 
              source={getImageSource(item.product.imagenes[0])} 
              style={styles.itemImage} 
            />

            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>{item.product.nombre}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.product.precio)}</Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.qtyButton} 
                  onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus color={colors.text} size={16} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.qtyButton} 
                  onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus color={colors.text} size={16} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.product.id)}>
              <Trash2 color={colors.error} size={20} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 👇 El footer ya NO es absoluto, ahora es un hermano natural */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  
  // 👇 Ya no necesita el paddingBottom gigante
  listContent: { padding: 20, paddingBottom: 20 },
  
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemName: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 8 },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    width: 100,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyButton: { padding: 4 },
  qtyText: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  
  deleteButton: { padding: 8 },

  // 👇 Footer como bloque natural
  footer: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: { fontSize: 18, color: colors.textSecondary, fontWeight: '600' },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  checkoutButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 30 },
  primaryButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});