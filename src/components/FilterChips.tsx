import { useSettings } from "@/hooks/useSettings";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type Props = {
    categories: string[];
    selected: string;
    onSelect: (c: string) => void;
};

export default function FilterChips({ categories, selected, onSelect }: Props) {
    const { colors } = useSettings();
    const styles = createStyles(colors);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            style={{ flexGrow: 0 }}
        >
            {categories.map((c) => {
                const isSelected = c === selected;
                return (
                    <Pressable
                        key={c}
                        onPress={() => onSelect(c)}
                        style={[styles.chip, isSelected && styles.activeChip]}
                    >
                        <Text style={[styles.text, isSelected && styles.activeText]}>
                            {c}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginVertical: 8,
        backgroundColor: colors.surface,
    },
    activeChip: {
        backgroundColor: colors.primaryDark,
    },
    text: {
        textTransform: 'capitalize',
        color: colors.text,
    },
    activeText: {
        color: colors.white,
        fontWeight: '600',
    },
});