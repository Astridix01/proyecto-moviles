import logo from '@/assets/images/joyeria/logo.jpeg';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import { getImageSource } from '@/utils/images';
import { useRouter } from 'expo-router';
import { Edit2, Plus, Trash2 } from 'lucide-react-native';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboard() {
  const { products, deleteProduct } = useProducts();
  const { colors } = useSettings();
  const router = useRouter();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.toolBar}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Image source={logo} style={styles.image} resizeMode="cover" />
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
              <Image 
                source={getImageSource(item.images[0])} 
                style={styles.itemImage} 
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              
              <TouchableOpacity onPress={() => router.push(`/admin/edit/${item.id}`)} style={styles.actionIcon}>
                <Edit2 color={colors.primaryDark} size={20} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => deleteProduct(item.id)} style={styles.actionIcon}>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toolBar: {
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
  image: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primaryDark,
    padding: 10,
    borderRadius: 8,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemPrice: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  actionIcon: {
    padding: 8,
  },
});