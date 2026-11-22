import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import type { Product } from '@/types/product';

const CATEGORIES = ['Aretes', 'Collares', 'Pulseras', 'Anillos'];

type ProductPayload = {
  name: string;
  price: string;
  description: string;
  category: string;
  material: string;
  imageUri: string | null;
};

type Props = {
  initialValues?: Partial<Product>;
  onSubmit: (data: ProductPayload) => Promise<void>;
  buttonText: string;
  isLoading?: boolean;
};

export default function ProductForm({ initialValues, onSubmit, buttonText, isLoading }: Props) {
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const [name, setName] = useState(initialValues?.name || '');
  const [price, setPrice] = useState(initialValues?.price || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || 'Aretes');
  const [material, setMaterial] = useState(initialValues?.material || '');
  const [imageUri, setImageUri] = useState<string | null>(
    initialValues?.images && initialValues.images.length > 0
      ? String(initialValues.images[0])
      : null
  );

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para elegir la imagen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !description.trim() || !material.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'El precio debe ser un número mayor a 0.');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        price: price.trim(),
        description: description.trim(),
        category,
        material: material.trim(),
        imageUri,
      });
    } catch (error: any) {
      const errorData = error.response?.data;
      let msg = 'No se pudo guardar el producto.';
      if (errorData) {
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError)) msg = firstError[0];
        else if (typeof firstError === 'string') msg = firstError;
      }
      Alert.alert('Error', msg);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Imagen del Producto</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <View style={{ width: '100%', height: '100%' }}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setImageUri(null)}
            >
              <X color={colors.white} size={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Camera color={colors.primaryDark} size={32} />
            <Text style={styles.imagePlaceholderText}>Seleccionar imagen</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej. Anillo de plata"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Ej. 150.00"
        keyboardType="decimal-pad"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.chipsContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
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
        value={description}
        onChangeText={setDescription}
        placeholder="Describe la pieza..."
        multiline
        numberOfLines={4}
        placeholderTextColor={colors.textSecondary}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.saveButtonText}>{buttonText}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: colors.surface, borderRadius: 10, padding: 14,
    fontSize: 16, color: colors.text, marginBottom: 8,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  imagePicker: {
    width: 130, height: 130, borderRadius: 16,
    backgroundColor: colors.surface, overflow: 'hidden',
    borderWidth: 2, borderColor: colors.primaryDark, borderStyle: 'dashed',
    alignSelf: 'flex-start', marginBottom: 8,
  },
  imagePreview: { width: '100%', height: '100%' },
  removeImageBtn: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: colors.error, borderRadius: 12,
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
  },
  imagePlaceholder: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  imagePlaceholderText: { fontSize: 11, color: colors.primaryDark, fontWeight: '600' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipActive: { backgroundColor: colors.primaryDark },
  chipText: { color: colors.text },
  chipTextActive: { color: colors.white },
  saveButton: {
    backgroundColor: colors.primaryDark, paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 24,
  },
  saveButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});