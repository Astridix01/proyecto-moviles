//TIENE ESTO PARA QUE NO ESTE VACIO CHECAR DESPUES 
import ProductCard from "@/components/ProductCard";
import { colors } from '@/constants/colors';
import { useFavorites } from "@/hooks/useFavorites";
import { productos } from "@/mocks/products";
import { Heart } from "lucide-react-native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favoritos() {
  const { favoritos } = useFavorites();
  const productosFavoritos= productos.filter((p) =>
     favoritos.includes(p.id))

  return (
    <SafeAreaView style= {styles.container} edges={['top']}>
      <View style={styles.encabezado}>
          <Text style = {styles.titulo}> 
         Favoritos
      </Text>
      </View>
     

   <FlatList 
   data={productosFavoritos}
   numColumns={2}
   contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1, }}
   keyExtractor={(item)=> String(item.id)}
   renderItem={({item}) => (
      <ProductCard product={item}/>
   )}
    ListEmptyComponent={
      <View style= {styles.vacio}>
          <Heart color={colors.accent} size= {35}/>
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
   container:{
   flex: 1,
   backgroundColor: colors.background,

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
});
