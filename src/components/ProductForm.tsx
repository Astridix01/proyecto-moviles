import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, ChevronLeft, ChevronRight, Star } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import type { Product } from '@/types/product';
import type { GalleryItem, ProductFormData } from '@/services/productService';

const CATEGORIES = ['Aretes', 'Collares', 'Pulseras', 'Anillos'];
const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp'];

type Props = {
  initialValues?: Partial<Product>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  buttonText: string;
  isLoading?: boolean;
};

const uriOf = (item: GalleryItem): string =>
  item.kind === 'existing' ? item.info.url : item.asset.uri;

const extOf = (uriOrName: string): string | null => {
  const match = /\.(\w+)(?:\?|$)/.exec(uriOrName);
  return match ? match[1].toLowerCase() : null;
};

export default function ProductForm({ initialValues, onSubmit, buttonText, isLoading }: Props) {
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const [name, setName] = useState(initialValues?.name || '');
  const [price, setPrice] = useState(initialValues?.price || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || 'Aretes');
  const [material, setMaterial] = useState(initialValues?.material || '');
  const [gallery, setGallery] = useState<GalleryItem[]>(
    initialValues?.imagesInfo?.map((info) => ({ kind: 'existing', info })) ?? []
  );

  const pickImages = async () => {
    if (gallery.length >= MAX_IMAGES) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }

    const remaining = MAX_IMAGES - gallery.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });
    if (result.canceled) return;

    const validAssets: ImagePicker.ImagePickerAsset[] = [];
    for (const asset of result.assets) {
      if (asset.fileSize && asset.fileSize > MAX_SIZE_MB * 1024 * 1024) {
        Alert.alert('Imagen demasiado grande', `${asset.fileName ?? 'Archivo'} supera ${MAX_SIZE_MB} MB.`);
        continue;
      }
      const ext = extOf(asset.fileName ?? asset.uri);
      if (ext && !ALLOWED_EXT.includes(ext)) {
        Alert.alert('Formato no soportado', 'Solo .jpg, .jpeg, .png, .webp.');
        continue;
      }
      validAssets.push(asset);
    }

    setGallery((prev) => [
      ...prev,
      ...validAssets.slice(0, remaining).map<GalleryItem>((asset) => ({ kind: 'new', asset })),
    ]);
  };

  const moveItem = (index: number, delta: number) => {
    setGallery((prev) => {
      const next = [...prev];
      const to = index + delta;
      if (to < 0 || to >= next.length) return prev;
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  };

  const removeItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
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

    const originalIds = (initialValues?.imagesInfo ?? []).map((i) => i.id);
    const keptIds = new Set(
      gallery
        .filter((g): g is Extract<GalleryItem, { kind: 'existing' }> => g.kind === 'existing')
        .map((g) => g.info.id)
    );
    const deletedIds = originalIds.filter((id) => !keptIds.has(id));

    try {
      await onSubmit({
        name: name.trim(),
        price: price.trim(),
        description: description.trim(),
        category,
        material: material.trim(),
        gallery,
        deletedIds,
      });
    } catch (error: any) {
      const data = error.response?.data;
      let msg = 'No se pudo guardar el producto.';
      if (data) {
        const first = Object.values(data)[0];
        if (Array.isArray(first)) msg = first[0];
        else if (typeof first === 'string') msg = first;
      }
      Alert.alert('Error', msg);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Galería ({gallery.length}/{MAX_IMAGES})</Text>
      <Text style={styles.hint}>
        La primera imagen es la principal. Usa ◀ ▶ para reordenar.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.galleryRow}
        contentContainerStyle={styles.galleryContent}
      >
        {gallery.map((item, index) => (
          <View key={index} style={styles.thumb}>
            <Image source={{ uri: uriOf(item) }} style={styles.thumbImage} resizeMode="cover" />

            {index === 0 && (
              <View style={styles.primaryBadge}>
                <Star color="#fff" size={12} fill="#fff" />
                <Text style={styles.primaryText}>Principal</Text>
              </View>
            )}

            <TouchableOpacity style={styles.thumbDelete} onPress={() => removeItem(index)}>
              <X color="#fff" size={14} />
            </TouchableOpacity>

            <View style={styles.thumbArrows}>
              <TouchableOpacity
                onPress={() => moveItem(index, -1)}
                disabled={index === 0}
                style={[styles.arrowBtn, index === 0 && { opacity: 0.3 }]}
              >
                <ChevronLeft color="#333" size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moveItem(index, 1)}
                disabled={index === gallery.length - 1}
                style={[styles.arrowBtn, index === gallery.length - 1 && { opacity: 0.3 }]}
              >
                <ChevronRight color="#333" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {gallery.length < MAX_IMAGES && (
          <TouchableOpacity style={styles.thumbAdd} onPress={pickImages}>
            <Camera color={colors.primaryDark} size={24} />
            <Text style={styles.thumbAddText}>Añadir</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName}
        placeholder="Ej. Anillo de plata" placeholderTextColor={colors.textSecondary} />

      <Text style={styles.label}>Precio</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice}
        placeholder="Ej. 150.00" keyboardType="decimal-pad"
        placeholderTextColor={colors.textSecondary} />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.chipsContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Material</Text>
      <TextInput style={styles.input} value={material} onChangeText={setMaterial}
        placeholder="Ej. Acero inoxidable" placeholderTextColor={colors.textSecondary} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]} value={description}
        onChangeText={setDescription} placeholder="Describe la pieza..."
        multiline numberOfLines={4} placeholderTextColor={colors.textSecondary}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color={colors.white} /> : (
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
  hint: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, fontSize: 16, color: colors.text, marginBottom: 8 },
  textArea: { height: 100, textAlignVertical: 'top' },
  galleryRow: { marginBottom: 8 },
  galleryContent: { gap: 12, paddingVertical: 4 },
  thumb: { width: 110, height: 130, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface },
  thumbImage: { width: '100%', height: 100 },
  primaryBadge: {
    position: 'absolute', top: 4, left: 4,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.primaryDark, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
  },
  primaryText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  thumbDelete: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: colors.error, borderRadius: 10, width: 20, height: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  thumbArrows: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 4, height: 30, alignItems: 'center',
  },
  arrowBtn: {
    width: 28, height: 24, borderRadius: 6,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
  },
  thumbAdd: {
    width: 110, height: 130, borderRadius: 12,
    borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primaryDark,
    justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: colors.surface,
  },
  thumbAddText: { fontSize: 11, color: colors.primaryDark, fontWeight: '600' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipActive: { backgroundColor: colors.primaryDark },
  chipText: { color: colors.text },
  chipTextActive: { color: colors.white },
  saveButton: { backgroundColor: colors.primaryDark, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});