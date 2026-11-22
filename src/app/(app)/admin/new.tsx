import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ProductForm from '@/components/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';

export default function NewProduct() {
  const { addProduct } = useProducts();
  const { colors } = useSettings();
  const router = useRouter();
  const styles = createStyles(colors);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await addProduct(data);
      Alert.alert('Éxito', 'Producto creado correctamente');
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
        <Text style={styles.headerTitle}>Nuevo Producto</Text>
      </View>
      <ProductForm onSubmit={handleSubmit} buttonText="Crear Producto" isLoading={isSaving} />
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