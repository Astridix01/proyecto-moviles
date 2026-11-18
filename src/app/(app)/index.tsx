import logo from '@/assets/images/joyeria/logo.jpeg';
import FilterChips from '@/components/FilterChips';
import Pagination from '@/components/Pagination';
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/constants/colors";
import { useSettings } from '@/hooks/useSettings';
import { productos } from "@/mocks/products";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Catalogo() {

   const [search, setsearch] = useState("");
   const [page, setPage] = useState(1);
   
   /*const [pageSize, setPageSize] = useState(6);*/
   const { pageSize } = useSettings();

   const [categoria, setCategoria] = useState("todos");
   const categorias = ["todos", "Aretes", "Collares", "Pulseras", "Anillos"];

   const filtrados = productos.filter((p) =>
      (categoria === "todos" || p.categoria === categoria) &&
      p.nombre.toLowerCase().includes(search.toLowerCase()));


   const inicio = (page - 1) * pageSize;
   const visibles = filtrados.slice(inicio, inicio + pageSize);
   const totalPages = Math.ceil(filtrados.length / pageSize)

   return (
      <SafeAreaView style={styles.container} edges={['top']}>
         {/* 
         <View style={styles.barra}>
            <Pressable style={styles.boton}>
               <Menu color={colors.accent} size={20} />
            </Pressable>
            <Pressable style={styles.boton}>
               <Settings color={colors.accent} size={20} />
            </Pressable>
         </View>*/}

         <View style={styles.barra}>
            <View style={styles.logo}>
               <View style={styles.logoIcon}>
                  <Image source={logo} style={styles.imagen} resizeMode="cover" />
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
            categorias={categorias}
            seleccionada={categoria}
            onSelect={(c) => { setCategoria(c); setPage(1); }}
         />

         <FlatList
            data={visibles}
            numColumns={2}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ProductCard product={item} />}
         />
         <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </SafeAreaView>
   );

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   /*
   barra: {
      flexDirection: 'row',
      justifyContent: 'space-between',  // uno a cada esquina
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
   },*/
   /*
   boton: {
      width: 40,
      height: 40,
      borderRadius: 22,                 // la mitad del ancho = círculo perfecto
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
   },*/

   

    imagen: {
        width: '100%',
        height: '100%',
        borderRadius: '100%',
    },

   barra: {
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
   },

   logoText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
   },
   
});
