import { useCart } from '@/hooks/useCart';
import { useSettings } from '@/hooks/useSettings';
import { formatPrice } from '@/utils/formatPrice';
import { getImageSource } from '@/utils/images';
import { router } from 'expo-router';
import {
  Minus, Plus, ShoppingBag, Trash2, X, Check,
  CreditCard, Banknote, Package, ShieldCheck,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, FlatList, Image, Modal,
  Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CheckoutStep = 'confirm' | 'processing' | 'success';
type PaymentMethod = 'card' | 'cash';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { colors } = useSettings();
  const styles = createStyles(colors);

  // --- ESTADOS DEL CHECKOUT ---
  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('confirm');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [orderNumber, setOrderNumber] = useState('');

  // Animación del check al finalizar
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Cálculos simulados de envío
  const ENVIO_GRATIS_DESDE = 500;
  const COSTO_ENVIO = 50;
  const envio = totalPrice >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
  const totalFinal = totalPrice + envio;

  // --- HANDLERS DEL CHECKOUT ---
  const openCheckout = () => {
    setStep('confirm');
    setPaymentMethod('card');
    setShowCheckout(true);
  };

  const handleConfirmPayment = () => {
    setStep('processing');

    // Generamos un número de orden ficticio
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(`ORD-${year}-${random}`);

    // Simulamos la llamada al backend (1.8s)
    setTimeout(() => {
      setStep('success');
      // Animación de check tipo rebote
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }, 1800);
  };

  const handleCloseCheckout = () => {
    if (step === 'success') {
      // Compra completada: vaciar carrito y volver al catálogo
      clearCart();
      setShowCheckout(false);
      setStep('confirm');
      scaleAnim.setValue(0);
      router.push('/');
    } else {
      // Cancelar sin comprar
      setShowCheckout(false);
      setStep('confirm');
    }
  };

  // --- ESTADO VACÍO ---
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

      <FlatList
        data={items}
        style={{ flex: 1 }}
        keyExtractor={(item) => String(item.product.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={getImageSource(item.product.images[0])}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>
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

      {/* Footer con Total */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={openCheckout}>
          <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
        </TouchableOpacity>
      </View>

      {/* ===================== MODAL DE CHECKOUT ===================== */}
      <Modal
        visible={showCheckout}
        animationType="slide"
        onRequestClose={handleCloseCheckout}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>

          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {step === 'confirm' && 'Confirmar compra'}
              {step === 'processing' && 'Procesando...'}
              {step === 'success' && '¡Listo!'}
            </Text>
            {step === 'confirm' && (
              <TouchableOpacity onPress={handleCloseCheckout} style={styles.closeBtn}>
                <X color={colors.text} size={22} />
              </TouchableOpacity>
            )}
          </View>

          {/* PASO 1: CONFIRMAR */}
          {step === 'confirm' && (
            <>
              <ScrollView contentContainerStyle={styles.modalContent}>

                {/* Resumen del pedido */}
                <Text style={styles.sectionLabel}>Resumen del pedido</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})
                    </Text>
                    <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Envío</Text>
                    <Text style={styles.summaryValue}>
                      {envio === 0 ? 'Gratis' : formatPrice(envio)}
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>{formatPrice(totalFinal)}</Text>
                  </View>
                </View>

                {/* Entrega estimada */}
                <View style={styles.deliveryCard}>
                  <Package color={colors.sageDark} size={22} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deliveryTitle}>Entrega estimada</Text>
                    <Text style={styles.deliveryText}>3-5 días hábiles</Text>
                  </View>
                </View>

                {/* Método de pago */}
                <Text style={styles.sectionLabel}>Método de pago</Text>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'card' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <CreditCard
                    color={paymentMethod === 'card' ? colors.primaryDark : colors.text}
                    size={24}
                  />
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>Tarjeta de crédito/débito</Text>
                    <Text style={styles.paymentSub}>Pago seguro</Text>
                  </View>
                  <View style={[styles.radio, paymentMethod === 'card' && styles.radioActive]}>
                    {paymentMethod === 'card' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'cash' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Banknote
                    color={paymentMethod === 'cash' ? colors.primaryDark : colors.text}
                    size={24}
                  />
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>Pago contra entrega</Text>
                    <Text style={styles.paymentSub}>Paga en efectivo al recibir</Text>
                  </View>
                  <View style={[styles.radio, paymentMethod === 'cash' && styles.radioActive]}>
                    {paymentMethod === 'cash' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>

                {/* Nota de seguridad */}
                <View style={styles.secureNote}>
                  <ShieldCheck color={colors.sageDark} size={16} />
                  <Text style={styles.secureText}>Compra protegida · Devolución gratis 30 días</Text>
                </View>
              </ScrollView>

              {/* Footer del paso 1 */}
              <View style={styles.modalFooter}>
                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalLabel}>Total a pagar</Text>
                  <Text style={styles.modalTotalAmount}>{formatPrice(totalFinal)}</Text>
                </View>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmPayment}>
                  <Text style={styles.confirmBtnText}>Confirmar pago</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* PASO 2: PROCESANDO */}
          {step === 'processing' && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primaryDark} />
              <Text style={styles.processingText}>Procesando pago seguro...</Text>
              <Text style={styles.processingSubtext}>Por favor no cierres la app</Text>
            </View>
          )}

          {/* PASO 3: ÉXITO */}
          {step === 'success' && (
            <>
              <View style={styles.centered}>
                <Animated.View
                  style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}
                >
                  <Check color={colors.white} size={44} strokeWidth={3} />
                </Animated.View>
                <Text style={styles.successTitle}>¡Pago exitoso!</Text>
                <Text style={styles.successSubtext}>
                  Tu pedido ha sido confirmado
                </Text>
                <View style={styles.orderNumberBox}>
                  <Text style={styles.orderNumberLabel}>Número de orden</Text>
                  <Text style={styles.orderNumberValue}>{orderNumber}</Text>
                </View>
                <View style={styles.deliveryCard}>
                  <Package color={colors.sageDark} size={22} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deliveryTitle}>Entrega estimada</Text>
                    <Text style={styles.deliveryText}>3-5 días hábiles a tu domicilio</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleCloseCheckout}>
                  <Text style={styles.confirmBtnText}>Volver al catálogo</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  // ========== PANTALLA CARRITO ==========
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
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
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: colors.background,
  },
  itemDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 8 },
  quantityContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background, borderRadius: 20,
    width: 100, justifyContent: 'space-between',
    paddingHorizontal: 8, paddingVertical: 4,
  },
  qtyButton: { padding: 4 },
  qtyText: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  deleteButton: { padding: 8 },

  footer: {
    backgroundColor: colors.background,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: colors.surface,
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  totalLabel: { fontSize: 18, color: colors.textSecondary, fontWeight: '600' },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  checkoutButton: {
    backgroundColor: colors.primaryDark, borderRadius: 12,
    height: 56, justifyContent: 'center', alignItems: 'center',
  },
  checkoutButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  // Empty
  emptyContainer: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 30 },
  primaryButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 30, paddingVertical: 14, borderRadius: 12,
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  // ========== MODAL CHECKOUT ==========
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 30,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },

  // Resumen
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, color: colors.text, fontWeight: '600' },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.primaryDark + '20',
    marginVertical: 10,
  },
  summaryTotalLabel: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  summaryTotalValue: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark },

  // Entrega
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.sage + '20',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  deliveryTitle: { fontSize: 13, fontWeight: '600', color: colors.sageDark },
  deliveryText: { fontSize: 14, color: colors.text, marginTop: 2 },

  // Métodos de pago
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryDark + '10',
  },
  paymentInfo: { flex: 1 },
  paymentTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  paymentSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center', alignItems: 'center',
  },
  radioActive: { borderColor: colors.primaryDark },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.primaryDark,
  },

  // Nota de seguridad
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: 16,
  },
  secureText: { fontSize: 12, color: colors.textSecondary },

  // Footer del modal
  modalFooter: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
    backgroundColor: colors.background,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTotalLabel: { fontSize: 16, color: colors.textSecondary, fontWeight: '600' },
  modalTotalAmount: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  confirmBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  // Estados centrales (procesando / éxito)
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
  },
  processingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },

  // Éxito
  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.sageDark,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.sageDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontSize: 26, fontWeight: 'bold',
    color: colors.text, marginBottom: 8,
  },
  successSubtext: {
    fontSize: 15, color: colors.textSecondary,
    marginBottom: 24, textAlign: 'center',
  },
  orderNumberBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumberLabel: {
    fontSize: 11, color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1,
    fontWeight: '600', marginBottom: 4,
  },
  orderNumberValue: {
    fontSize: 18, fontWeight: 'bold',
    color: colors.primaryDark, letterSpacing: 1,
  },
});