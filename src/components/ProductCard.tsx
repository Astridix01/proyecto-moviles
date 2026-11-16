import { colors } from '@/constants/colors';
import { useFavorites } from "@/hooks/useFavorites";
import type { Product } from '@/types/product';
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
    const router = useRouter();
    const { esFavorito, toggleFavorito } = useFavorites();
    return (
        <Pressable style={styles.contenedor} onPress={() => router.push(`/product/${product.id}`)}>
            <View style={styles.card}>
                <View style={styles.imagenWrapper}>
                    <Image source={product.imagenes[0]} style={styles.imagen} resizeMode="cover" />
                    <Pressable style={styles.corazon} onPress={() => toggleFavorito(product.id)}>
                        <Heart
                            color={colors.surface2}
                            size={18}
                            fill={esFavorito(product.id) ? colors.surface2 : 'transparent'}
                        />
                    </Pressable>
                </View>

                <View style={styles.textos}>
                    <Text style={styles.nombre} numberOfLines={1}>
                        {product.nombre}
                    </Text>
                    <Text style={styles.descripcion} numberOfLines={2}>
                        {product.descripcion}
                    </Text>
                    <Text style={styles.precio}>
                        {formatPrice(product.precio)}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        maxWidth: '50%',          // evita que un item solitario se estire
    },
    card: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        margin: 6,
        overflow: 'hidden',
    },

    imagenWrapper: {
        width: '100%',
        aspectRatio: 1,           // cuadrado
    },

    imagen: {
        width: '100%',
        height: '100%',
    },

    textos: {
        padding: 8,
    },

    nombre: {
        fontSize: 16,
        color: colors.text,
    },

    descripcion: {
        fontSize: 13,
        color: colors.textSecondary,
    },

    precio: {
        fontSize: 14,
        color: colors.text,
    },

    corazon: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 5,
    },
});