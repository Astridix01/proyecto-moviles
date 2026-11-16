import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    page: number;
    totalPages: number;
    onChange: (newPage: number) => void; 
}

export default function Pagination({page, totalPages, onChange}: Props){
    return (
        <View style={styles.fila}>
            <Pressable onPress={() => onChange(page - 1)} disabled={page === 1}>
                <ChevronLeft size = {20}/>
            </Pressable>
            <Text>Página {page} de {totalPages}</Text>
            <Pressable onPress={() => onChange(page + 1)} disabled={page === totalPages}>
                <ChevronRight size = {20}/>
            </Pressable>
        </View>
    );
} 

const styles = StyleSheet.create({
    fila:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        gap: 16,
    },

})



