
import { useSettings } from '@/hooks/useSettings';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    page: number;
    totalPages: number;
    onChange: (newPage: number) => void;
}

export default function Pagination({ page: page, totalPages, onChange }: Props) {
    const { colors } = useSettings();
    const styles = createStyles(colors);

    if (totalPages <= 1) return null;

    const canGoPrev = page > 1;
    const canGoNext = page < totalPages;

    return (
        <View style={styles.container}>

            {/* Botón Atrás */}
            <Pressable
                onPress={() => onChange(page - 1)}
                disabled={!canGoPrev}
                style={({ pressed }) => [
                    styles.button,
                    !canGoPrev && styles.buttonDisabled,
                    pressed && canGoPrev && styles.buttonPressed,
                ]}
            >
                <ChevronLeft
                    color={canGoPrev ? colors.text : colors.textSecondary}
                    size={22}
                />
            </Pressable>

            <View style={styles.pageInfo}>
                <Text style={styles.pageLabel}>Página</Text>
                <View style={styles.pageNumbers}>
                    <Text style={styles.currentPage}>{page}</Text>
                    <Text style={styles.separator}>/</Text>
                    <Text style={styles.totalPages}>{totalPages}</Text>
                </View>
            </View>

            <Pressable
                onPress={() => onChange(page + 1)}
                disabled={!canGoNext}
                style={({ pressed }) => [
                    styles.button,
                    !canGoNext && styles.buttonDisabled,
                    pressed && canGoNext && styles.buttonPressed,
                ]}
            >
                <ChevronRight
                    color={canGoNext ? colors.text : colors.textSecondary}
                    size={22}
                />
            </Pressable>

        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 10,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    pageInfo: {
        alignItems: 'center',
        minWidth: 80,
    },
    pageLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
        marginBottom: 2,
    },
    pageNumbers: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    currentPage: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    separator: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    totalPages: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});