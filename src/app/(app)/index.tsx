import FilterChips from '@/components/FilterChips';
import Pagination from '@/components/Pagination';
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/constants/colors";
import { productos } from "@/mocks/products";
import { Menu, Settings } from 'lucide-react-native';
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Catalogo() {

const [busqueda, setBusqueda] = useState("");
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(6);
const [categoria, setCategoria] = useState("todos");
const categorias=["todos", "Aretes", "Collares", "Pulseras", "Anillos"];

const filtrados = productos.filter((p) =>
   (categoria === "todos" || p.categoria === categoria) &&
   p.nombre.toLowerCase().includes(busqueda.toLowerCase()));


const inicio = (page-1)* pageSize;
const visibles = filtrados.slice(inicio, inicio + pageSize);
const totalPages = Math.ceil(filtrados.length / pageSize)

return (
   <SafeAreaView style={styles.container} edges={['top']}>
      <View style ={styles.barra}>
         <Pressable style = {styles.boton}>
          <Menu color= {colors.accent} size = {20}/>
         </Pressable>
           <Pressable style = {styles.boton}>
            <Settings color= {colors.accent} size = {20}/>
           </Pressable>
      </View>
   <SearchBar
      value={busqueda} onChangeText={(texto) => {
         setBusqueda(texto);
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
   keyExtractor={(item)=> String(item.id)}
   renderItem={({item}) => (
      <ProductCard product={item}/>
   )}
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

   barra: {
   flexDirection: 'row',
   justifyContent: 'space-between',  // uno a cada esquina
   alignItems: 'center',
   paddingHorizontal: 16,
   paddingVertical: 8,
   },

   boton:{
   width: 40,
   height: 40,
   borderRadius: 22,                 // la mitad del ancho = círculo perfecto
   backgroundColor: colors.surface,
   justifyContent: 'center',
   alignItems: 'center',
    },
});
