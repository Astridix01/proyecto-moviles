import ProductForm from "@/components/ProductForm";
import { useProducts } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const { products, updateProduct } = useProducts();
  const { colors } = useSettings();
  const router = useRouter();
  const styles = createStyles(colors);

  const productToEdit = products.find(p => p.id === Number(id));

  if (!productToEdit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 50 }}>
          Producto no encontrado
        </Text>
      </SafeAreaView>
    );
  }

  const handleSubmit = (updatedData: any) => {
    updateProduct(productToEdit.id, { ...updatedData, id: productToEdit.id });
    router.back();
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
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 16,
  },
});