import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProductForm from '@/components/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import type { ProductFormData } from '@/services/productService';

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const { products, updateProduct, fetchProducts } = useProducts();
  const { colors } = useSettings();
  const router = useRouter();
  const styles = createStyles(colors);
  const [isSaving, setIsSaving] = useState(false);

  const productToEdit = products.find((p) => p.id === Number(id));

  if (!productToEdit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.primaryDark} size="large" />
          <Text style={{ color: colors.textSecondary, marginTop: 12 }}>
            Cargando producto...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    try {
      await updateProduct(productToEdit.id, data);
      await fetchProducts({ pageSize: 100 });
      Alert.alert('Éxito', 'Producto actualizado correctamente');
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Producto</Text>
      </View>
      <ProductForm
        initialValues={productToEdit}
        onSubmit={handleSubmit}
        buttonText="Guardar Cambios"
        isLoading={isSaving}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.surface,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
});