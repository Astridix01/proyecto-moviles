//TIENE ESTO PARA QUE NO ESTE VACIO CHECAR DESPUES 
import ImageCarousel from "@/components/ImageCarousel";
import { colors } from "@/constants/colors";
import { useFavorites } from "@/hooks/useFavorites";
import { productos } from "@/mocks/products";
import { formatPrice } from "@/utils/formatPrice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Heart } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ProductoDetalle () {
  const {id} = useLocalSearchParams();
  const producto = productos.find((p) => p.id === Number(id));
  const router = useRouter();
  const { esFavorito, toggleFavorito } = useFavorites();

  if (!producto) {
  return (
    <View>
      <Text>Producto no encontrado</Text>
    </View>
  );
}
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView> 
        <View>
        <ImageCarousel imagenes={producto.imagenes} />

         <Pressable style= {styles.corazon} onPress={() => toggleFavorito(producto.id)} >
            <Heart color= {colors.surface2} size = {22} fill={esFavorito(producto.id) ? colors.surface2 : 'transparent'}/>
            </Pressable>

            <Pressable style={styles.atras} onPress={() => router.back()}>
                <ChevronLeft color = {colors.accent} size = {22}/>
            </Pressable>
        </View>

        <View style={styles.info}>
          <Text style={styles.nombre} >
            {producto.nombre}
          </Text>
          <Text style={styles.precio}>
            {formatPrice(producto.precio)}
          </Text>
          <Text style = {styles.categoria}>
            {producto.categoria}
          </Text>
          <Text style = {styles.material}>
            {producto.material}
          </Text>
            <Text style = {styles.descripcion}>
            {producto.descripcion}
          </Text>
                  
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: colors.background,
  },
  info: {
    padding: 16,
  },

  imagen:{
    width: '100%',
    aspectRatio:1,
   // height: 170,
    //borderRadius: 15,
     //alignSelf: 'center',
  },

  nombre:{
    fontWeight: 'bold',
    fontSize:22,
    color: colors.text,
  },

  precio:{
    fontSize: 20,
    color: colors.text,
  },

  categoria:{
    fontSize: 15,
    color: colors.textSecondary,
  },

  material:{
    fontSize: 15,
    color: colors.textSecondary,
  },

  descripcion:{
    fontSize: 15,
    color: colors.textSecondary,
  },
  corazon:{
    position: 'absolute',
    top: 20,
    right: 15,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 10,
  },

  atras: {
    position: 'absolute',
    top: 20,
    left: 15,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 10,
},
});

