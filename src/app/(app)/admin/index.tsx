import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Plus, Edit2, Trash2 } from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import { getImageSource } from '@/utils/images';
import logo from '@/assets/images/joyeria/logo.jpeg';

export default function AdminDashboard() {
  const { products, deleteProduct, fetchProducts } = useProducts();
  const { colors } = useSettings();
  const router = useRouter();
  const styles = createStyles(colors);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 👇 Refresca cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      fetchProducts({ pageSize: 100 });
    }, [])
  );

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de eliminar "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteProduct(id);
              await fetchProducts({ pageSize: 100 });
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.barra}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Image source={logo} style={styles.imagen} resizeMode="cover" />
          </View>
          <Text style={styles.logoText}>Yatzari</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Inventario</Text>
          <TouchableOpacity onPress={() => router.push('/admin/new')} style={styles.addButton}>
            <Plus color={colors.white} size={20} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Image source={getImageSource(item.images[0])} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push(`/admin/edit/${item.id}`)} style={styles.actionIcon}>
                <Edit2 color={colors.primaryDark} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.name)}
                style={styles.actionIcon}
                disabled={deletingId === item.id}
              >
                <Trash2 color={colors.error} size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  barra: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  imagen: { width: '100%', height: '100%' },
  logoText: { fontSize: 20, fontWeight: '700', color: colors.text, letterSpacing: 1.5, textTransform: 'uppercase' },
  content: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  addButton: { backgroundColor: colors.primaryDark, padding: 10, borderRadius: 8 },
  itemCard: { flexDirection: 'row', backgroundColor: colors.surface, padding: 10, marginBottom: 10, borderRadius: 10, alignItems: 'center' },
  itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemName: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
  itemPrice: { color: colors.textSecondary, fontSize: 14 },
  actionIcon: { padding: 8 },
});