// src/app/(app)/index.tsx
import logo from '@/assets/images/joyeria/logo.jpeg';
import FilterChips from '@/components/FilterChips';
import Pagination from '@/components/Pagination';
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import ToastCarrito from "@/components/ToastCarrito";
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import type { Product } from '@/types/product';
import { useEffect, useRef, useState, useCallback } from "react";
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Catalog() {
   const [search, setSearch] = useState("");
   const [page, setPage] = useState(1);

   const { pageSize, colors } = useSettings();
   const { products, totalCount, isLoading, fetchProducts } = useProducts();
   const styles = createStyles(colors);

   const [category, setCategory] = useState("todos");
   const categories = ["todos", "Aretes", "Collares", "Pulseras", "Anillos"];

   const [showToast, setShowToast] = useState(false);
   const [lastAddedName, setLastAddedName] = useState("");
   const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

   const handleProductAdded = (product: Product) => {
      setLastAddedName(product.name);
      setShowToast(true);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2500);
   };

   // 👇 EFECTO CON DEBOUNCE PARA BÚSQUEDA Y PAGINACIÓN
   useFocusEffect(
      useCallback(() => {
         const timer = setTimeout(() => {
            fetchProducts({
               page: page,
               pageSize: pageSize,
               search: search,
               category: category,
            });
         }, 300);
         return () => clearTimeout(timer);
      }, [page, search, category, pageSize])
   );

   // Reseteamos la página a 1 si cambia la búsqueda o la categoría
   useEffect(() => { setPage(1); }, [search, category, pageSize]);

   const totalPages = Math.ceil(totalCount / pageSize);

   return (
      <SafeAreaView style={styles.container} edges={['top']}>
         <View style={styles.bar}>
            <View style={styles.logo}>
               <View style={styles.logoIcon}>
                  <Image source={logo} style={styles.image} resizeMode="cover" />
               </View>
               <Text style={styles.logoText}>Yatzari</Text>
            </View>
         </View>

         <SearchBar
            value={search} onChangeText={setSearch}
         />
         <FilterChips
            categories={categories}
            selected={category}
            onSelect={setCategory}
         />

         {/* 👇 MOSTRAMOS LOADER MIENTRAS CARGA */}
         {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <ActivityIndicator size="large" color={colors.primaryDark} />
            </View>
         ) : (
            <FlatList
               data={products}
               numColumns={2}
               style={{ flex: 1 }}
               contentContainerStyle={{ paddingHorizontal: 10 }}
               keyExtractor={(item) => String(item.id)}
               renderItem={({ item }) => (
                  <ProductCard
                     product={item}
                     onAdded={() => handleProductAdded(item)}
                  />
               )}
            />
         )}

         {!isLoading && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
         )}

         <ToastCarrito visible={showToast} productName={lastAddedName} />
      </SafeAreaView>
   );
}

const createStyles = (colors: any) => StyleSheet.create({
   container: { flex: 1, backgroundColor: colors.background },
   image: { width: '100%', height: '100%', borderRadius: 20 },
   bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
   logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
   logoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
   logoText: { fontSize: 20, fontWeight: '700', color: colors.text, letterSpacing: 1.5, textTransform: 'uppercase' },
});