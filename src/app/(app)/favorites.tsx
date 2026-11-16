//TIENE ESTO PARA QUE NO ESTE VACIO CHECAR DESPUES 
import ProductCard from "@/components/ProductCard";
import { colors } from '@/constants/colors';
import { useFavorites } from "@/hooks/useFavorites";
import { productos } from "@/mocks/products";
import { Gem, Heart } from "lucide-react-native";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '@/assets/images/joyeria/logo.jpeg';

export default function Favoritos() {
  const { favoritos } = useFavorites();
  const productosFavoritos = productos.filter((p) =>
    favoritos.includes(p.id))

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


      <FlatList
        data={productosFavoritos}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1, }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Heart color={colors.surface2} size={35} />
            <Text>Aún no tienes favoritos</Text>
            <Text style={styles.vacioTexto}>
              Toca el corazón en un producto para guardarlo aquí
            </Text>




          </View>
        }
      />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,

  },

  imagen: {
        width: '100%',
        height: '100%',
        borderRadius: '100%',
  },

  encabezado: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    marginHorizontal: 80,
    marginTop: 20,
    marginBottom: 4,
    paddingVertical: 8,
    alignItems: 'center',
    // flex: 1,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'colors.text',
  },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  vacioTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  barra: {
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
   },

   logoText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
   },
});
