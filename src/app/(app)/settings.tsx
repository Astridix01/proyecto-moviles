import { useState } from 'react';
import logo from '@/assets/images/joyeria/logo.jpeg';
import { useSettings } from '@/hooks/useSettings';
import { useRouter } from 'expo-router';
import {
  Check,
  ChevronLeft,
  Flower,
  Moon,
  Package,
  Palette,
  Sun,
} from 'lucide-react-native';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50];

export default function Settings() {
  const { pageSize, setPageSize, isDark, setTheme, colors } = useSettings();
  const router = useRouter();

  const [isSyncingTheme, setIsSyncingTheme] = useState(false);
  const [isSyncingPageSize, setIsSyncingPageSize] = useState(false);

  const styles = createStyles(colors);

  const handleThemeChange = async (value: boolean) => {
    if (isSyncingTheme) return;
    setIsSyncingTheme(true);
    try {
      await setTheme(value ? 'dark' : 'light');
    } catch {
      Alert.alert(
        'No se pudo guardar',
        'Verifica tu conexión e intenta de nuevo.'
      );
    } finally {
      setIsSyncingTheme(false);
    }
  };

  const handlePageSizeChange = async (n: number) => {
    if (isSyncingPageSize || n === pageSize) return;
    setIsSyncingPageSize(true);
    try {
      await setPageSize(n);
    } catch {
      Alert.alert(
        'No se pudo guardar',
        'Verifica tu conexión e intenta de nuevo.'
      );
    } finally {
      setIsSyncingPageSize(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.bar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color={colors.text} size={24} />
          </Pressable>

          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <Image source={logo} style={styles.image} resizeMode="cover" />
            </View>
            <Text style={styles.logoText}>Yatzari</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.settingsText}>Configuración</Text>
          <Text style={styles.subtitle}>
            Personaliza tu experiencia en Yatzari.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.box}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Package color={colors.primaryDark} size={21} />
              </View>
              <View style={styles.sectionInfo}>
                <Text style={styles.titleSection}>
                  Visualización de productos
                </Text>
                <Text style={styles.description}>
                  Elige cuántos productos deseas mostrar por página.
                </Text>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <Pressable
                  key={n}
                  disabled={isSyncingPageSize}
                  onPress={() => handlePageSizeChange(n)}
                  style={[
                    styles.options,
                    n === pageSize && styles.activeOptions,
                    isSyncingPageSize && { opacity: 0.6 },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      n === pageSize && styles.activeOptionText,
                    ]}
                  >
                    {n}
                  </Text>
                  {n === pageSize && (
                    <Check size={13} color={colors.white} />
                  )}
                </Pressable>
              ))}
            </View>

            <Text style={styles.selectedText}>
              {pageSize} productos seleccionados
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.box}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Palette color={colors.primaryDark} size={21} />
              </View>
              <View style={styles.sectionInfo}>
                <Text style={styles.titleSection}>Apariencia</Text>
                <Text style={styles.description}>
                  Personaliza la apariencia de tu aplicación.
                </Text>
              </View>
            </View>

            <View style={styles.switchBox}>
              <View style={styles.themeInfo}>
                <View style={styles.themeIcon}>
                  {isDark ? (
                    <Moon color={colors.primaryDark} size={21} />
                  ) : (
                    <Sun color={colors.primaryDark} size={21} />
                  )}
                </View>
                <View style={styles.themeTextContainer}>
                  <Text style={styles.themeTitle}>Modo oscuro</Text>
                  <Text style={styles.description}>
                    {isDark
                      ? 'Tema oscuro activado'
                      : 'Tema claro activado'}
                  </Text>
                </View>
              </View>

              <Switch
                disabled={isSyncingTheme}
                value={isDark}
                onValueChange={handleThemeChange}
                trackColor={{
                  false: colors.lavender,
                  true: colors.primaryDark,
                }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Flower color={colors.primaryDark} size={25} />
          <Text style={styles.footerTitle}>Yatzari</Text>
          <Text style={styles.footerText}>Belleza en cada detalle.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 14,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  logoText: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 25,
  },

  settingsText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.65,
    marginTop: 6,
  },

  section: {
    marginHorizontal: 18,
    marginBottom: 18,
  },

  box: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 18,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionInfo: {
    flex: 1,
    gap: 4,
  },

  titleSection: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.text,
  },

  description: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.65,
    lineHeight: 17,
  },

  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  options: {
    flex: 1,
    minHeight: 43,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },

  activeOptions: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },

  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  activeOptionText: {
    color: colors.white,
  },

  selectedText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
    marginTop: -8,
  },

  switchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lavender,
    paddingTop: 16,
  },

  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  themeTextContainer: {
    flex: 1,
    gap: 4,
  },

  themeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  footer: {
    alignItems: 'center',
    marginTop: 25,
    gap: 6,
  },

  footerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
  },

  footerText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },

});