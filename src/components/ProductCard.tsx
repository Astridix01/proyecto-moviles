import { useFavorites } from "@/hooks/useFavorites";
import { useSettings } from "@/hooks/useSettings";
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types/product';
import { formatPrice } from "@/utils/formatPrice";
import { getImageSource } from '@/utils/images'; // 👈 NUEVO IMPORT
import { useRouter } from 'expo-router';
import { Heart, Plus } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

type Props = { 
    product: Product; 
    onAdded?: () => void; 
};

export default function ProductCard({ product, onAdded }: Props) {
    const router = useRouter();
    const { esFavorito, toggleFavorito } = useFavorites();
    const { addItem } = useCart();
    
    const { colors } = useSettings();
    const styles = createStyles(colors);

    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        addItem(product);
        if (onAdded) {
            onAdded();
        }
    };

    return (
        <Pressable style={styles.contenedor} onPress={() => router.push(`/product/${product.id}`)}>
            <View style={styles.card}>
                <View style={styles.imagenWrapper}>
                    {/* 👇 Usamos getImageSource para soportar mocks y URLs */}
                    <Image 
                        source={getImageSource(product.imagenes[0])} 
                        style={styles.imagen} 
                        resizeMode="cover" 
                    />
                    <Pressable style={styles.corazon} onPress={() => toggleFavorito(product.id)}>
                        <Heart
                            color={colors.surface2}
                            size={18}
                            fill={esFavorito(product.id) ? colors.surface2 : 'transparent'}
                        />
                    </Pressable>
                </View>

                <View style={styles.textos}>
                    <Text style={styles.nombre} numberOfLines={1}>{product.nombre}</Text>
                    <Text style={styles.descripcion} numberOfLines={2}>{product.descripcion}</Text>
                    
                    <View style={styles.precioRow}>
                        <Text style={styles.precio}>{formatPrice(product.precio)}</Text>
                        
                        <TouchableOpacity style={styles.btnAgregar} onPress={handleAddToCart}>
                            <Plus color={colors.white} size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

// 👇 Estilos (sin cambios)
const createStyles = (colors: any) => StyleSheet.create({
    contenedor: {
        flex: 1,
        maxWidth: '50%',
    },
    card: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        margin: 6,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imagenWrapper: {
        width: '100%',
        aspectRatio: 1,
    },
    imagen: {
        width: '100%',
        height: '100%',
    },
    textos: {
        padding: 10,
    },
    nombre: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    descripcion: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    precioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    precio: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    btnAgregar: {
        backgroundColor: colors.primaryDark,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
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