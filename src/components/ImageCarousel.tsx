import { useSettings } from "@/hooks/useSettings"; // 👈 Hook de colores
import { getImageSource } from "@/utils/images"; // 👈 Helper de imágenes
import { useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

// 👇 Tipo actualizado: acepta imports locales (mock) y URLs (backend)
type Props = { imagenes: (ImageSourcePropType | string)[] };

export default function ImageCarousel({ imagenes }: Props) {
  const [indice, setIndice] = useState(0);
  const { width } = useWindowDimensions();

  // 👇 Colores dinámicos y estilos
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const manejarFinScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setIndice(Math.round(offsetX / width));
  };

  return (
    <View>
      <FlatList
        data={imagenes}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={manejarFinScroll}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => (
          // 👇 Usamos el helper para soportar mocks y URLs
          <Image 
            source={getImageSource(item)} 
            style={{ width: width, aspectRatio: 1 }} 
          />
        )}
      />
      {imagenes.length > 1 && (
        <View style={styles.puntos}>
          {imagenes.map((_, i) => (
            <View
              key={i}
              style={[styles.punto, i === indice && styles.puntoActivo]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// 👇 Estilos dinámicos según el tema
const createStyles = (colors: any) => StyleSheet.create({
  puntos: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    opacity: 0.4,
  },
  puntoActivo: {
    backgroundColor: colors.primaryDark,
    opacity: 1,
  },
});