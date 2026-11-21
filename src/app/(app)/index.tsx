import logo from '@/assets/images/joyeria/logo.jpeg';
import FilterChips from '@/components/FilterChips';
import Pagination from '@/components/Pagination';
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import ToastCarrito from "@/components/ToastCarrito";
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import type { Product } from '@/types/product';
import { useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Catalog() {

   const [search, setsearch] = useState("");
   const [page, setPage] = useState(1);
   
   const { pageSize, colors } = useSettings();
   const { products } = useProducts();
   const styles = createStyles(colors);

   const [category, setCategory] = useState("todos");
   const categories = ["todos", "Aretes", "Collares", "Pulseras", "Anillos"];

   const [showToast, setShowToast] = useState(false);
   const [lastAddedName, setLastAddedName] = useState("");
   const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

   const handleProductAdded = (product: Product) => {
      setLastAddedName(product.name);
      setShowToast(true);

      if (toastTimeout.current) {
         clearTimeout(toastTimeout.current);
      }

      toastTimeout.current = setTimeout(() => {
         setShowToast(false);
      }, 2500);
   };

   const already_filtered = products.filter((p) =>
      (category === "todos" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()));

   const start = (page - 1) * pageSize;
   const visibles = already_filtered.slice(start, start + pageSize);
   const totalPages = Math.ceil(already_filtered.length / pageSize);

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
            value={search} onChangeText={(texto) => {
               setsearch(texto);
               setPage(1);
            }}
         />
         <FilterChips
            categories={categories}
            selected={category}
            onSelect={(c) => { setCategory(c); setPage(1); }}
         />

         <FlatList
            data={visibles}
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
         <Pagination page={page} totalPages={totalPages} onChange={setPage} />
         
         <ToastCarrito visible={showToast} productName={lastAddedName} />
      </SafeAreaView>
   );
}

const createStyles = (colors: any) => StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   image: {
      width: '100%',
      height: '100%',
      borderRadius: 20, 
   },
   bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 10,
   },
   logo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
   },
   logoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', 
   },
   logoText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
   },
});