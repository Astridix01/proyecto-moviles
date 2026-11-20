import { colors } from "@/constants/colors";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type Props = {
    categories: string[];
    selected: string;
    onSelect: (c: string) => void;
};

export default function FilterChips({ categories: categorias, selected: seleccionada, onSelect }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            style={{ flexGrow: 0 }}
        >
            {categorias.map((c) => (
                <Pressable
                    key={c}
                    onPress={() => onSelect(c)}
                    style={[styles.chip, c === seleccionada && styles.chipActivo]}
                >
                    <Text style={styles.texto}>{c}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginVertical: 8,
        backgroundColor: colors.surface,
    },

    chipActivo: {
        backgroundColor: colors.primaryDark
    },

    texto: {
        textTransform: 'capitalize',
        color: colors.text
    },
})