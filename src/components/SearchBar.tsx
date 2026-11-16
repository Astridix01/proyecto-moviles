//https://lucide.dev/icons/
//https://react-icons.github.io/react-icons/

import { colors } from '@/constants/colors';
import { Search } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
    value: string; 
    onChangeText: (text: string) => void;
}

export default function SearchBar({value, onChangeText}: Props){
    return (
        <View style={styles.contenedor}>
            <Search color= {colors.text} size = {20}/>
            <TextInput style={styles.input}
            placeholderTextColor={colors.textSecondary}
            placeholder="Buscar productos..."
            value={value}
            onChangeText={onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor:{
        flexDirection: 'row',     // ícono y texto lado a lado
        alignItems: 'center',     // alineados verticalmente al centro
        backgroundColor: colors.surface,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginHorizontal: 10,

    },

    input:{
        flex: 1,      
        marginLeft: 8,  
        fontSize: 15,
        height: 44,
    },

});
