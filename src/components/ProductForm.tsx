import { useSettings } from '@/hooks/useSettings';
import type { Product } from '@/types/product';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Importamos algunas imágenes locales para usarlas como "opciones" en el CRUD
import img1 from '@/assets/images/joyeria/anillos.jpeg';
import img2 from '@/assets/images/joyeria/collar1.jpeg';
import img4 from '@/assets/images/joyeria/monos.jpeg';
import img3 from '@/assets/images/joyeria/pulsera.jpeg';

const AVAILABLE_IMAGES = [img1, img2, img3, img4];
const CATEGORIAS = ["Aretes", "Collares", "Pulseras", "Anillos"];

type Props = {
  initialValues?: Partial<Product>;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  buttonText: string;
};

export default function ProductForm({ initialValues, onSubmit, buttonText }: Props) {
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const [nombre, setNombre] = useState(initialValues?.name || '');
  const [precio, setPrecio] = useState(initialValues?.price?.toString() || '');
  const [descripcion, setDescripcion] = useState(initialValues?.description || '');
  const [categoria, setCategoria] = useState(initialValues?.category || 'Aretes');
  const [material, setMaterial] = useState(initialValues?.material || '');
  
  // Estado para la imagen seleccionada (por defecto la primera)
  const [selectedImage, setSelectedImage] = useState<any>(
    initialValues?.images ? initialValues.images[0] : AVAILABLE_IMAGES[0]
  );

  const handleSave = () => {
    if (!nombre || !precio || !descripcion || !material) {
      Alert.alert('Error', 'Por favor, llena todos los campos.');
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum)) {
      Alert.alert('Error', 'El precio debe ser un número válido.');
      return;
    }

    onSubmit({
      name: nombre,
      price: precioNum,
      description: descripcion,
      category: categoria,
      material,
      images: [selectedImage], // Guardamos el array de imágenes
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Selector de Imagen (Simulado) */}
      <Text style={styles.label}>Imagen del Producto</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageSelector}>
        {AVAILABLE_IMAGES.map((img, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => setSelectedImage(img)}
            style={[
              styles.imageOption, 
              selectedImage === img && { borderColor: colors.primaryDark, borderWidth: 3 }
            ]}
          >
            <Image source={img} style={styles.imagePreview} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej. Anillo de plata"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        placeholder="Ej. 150"
        keyboardType="numeric"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.chipsContainer}>
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, categoria === cat && styles.chipActive]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={[styles.chipText, categoria === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Material</Text>
      <TextInput
        style={styles.input}
        value={material}
        onChangeText={setMaterial}
        placeholder="Ej. Acero inoxidable"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Describe la pieza..."
        multiline
        numberOfLines={4}
        placeholderTextColor={colors.textSecondary}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{buttonText}</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
  },
  chipText: {
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  imageSelector: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageOption: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});