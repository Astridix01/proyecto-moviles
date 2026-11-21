import { useSettings } from '@/hooks/useSettings';
import { Search } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
    value: string;
    onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: Props) {
    const { colors } = useSettings();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Search color={colors.text} size={20} />
            <TextInput
                style={styles.input}
                placeholderTextColor={colors.textSecondary}
                placeholder="Buscar productos..."
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        height: 44,
        color: colors.text,
    },
});