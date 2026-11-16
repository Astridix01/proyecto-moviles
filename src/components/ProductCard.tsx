import { colors } from '@/constants/colors';
import { useFavorites } from "@/hooks/useFavorites";
import type { Product } from '@/types/product';
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {product: Product};

export default function ProductCard ({product}: Props) {
    const router = useRouter();
    const { esFavorito, toggleFavorito } = useFavorites();
    return(
        <Pressable style= {styles.contenedor} onPress={() => router.push(`/product/${product.id}`)}>
        <View style={styles.card}> 
        <Image source = {{uri: product.imagenes[0]}} style = {styles.imagen} resizeMode="cover" />
        <Pressable style= {styles.corazon} onPress={() => toggleFavorito(product.id)} >
            <Heart color= {colors.accent} size = {22} fill={esFavorito(product.id) ? colors.accent : 'transparent'}/>
            </Pressable>
           <View style={styles.fila}>
            <View style={styles.textos}>
                 <Text style={styles.nombre}>
                  {product.nombre}
                 </Text>
                 <Text style={styles.descripcion}>
                  {product.descripcion}
                 </Text>
                 <Text style={styles.precio}>
                  {formatPrice(product.precio)}
                  </Text>
            </View>
            
            </View> 
        </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    contenedor:{
        flex: 1,
    },
    card:{
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 15,
        margin: 6,
        overflow: 'hidden',
    },

    imagen:{
        width: '100%',
        aspectRatio:1,
        borderRadius: 15,
    },

    nombre:{
        fontSize: 20,
        color: colors.text,

    },

    descripcion: {
        fontSize: 15,
        color: colors.textSecondary,

    },

    precio:{
        fontSize: 16,
        color: colors.text,
    },

    fila: {
    flexDirection: 'row',
    alignItems: 'flex-end',   // alinea el corazón con el precio, abajo
    padding: 8,
    },

    textos: {
    flex: 1,                  // ocupa todo el espacio y empuja el corazón a la derecha
    },

    corazon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 6,
    },
});