import logo from '@/assets/images/joyeria/logo.jpeg';
import { useSettings } from '@/hooks/useSettings';
import { usePathname, useRouter } from 'expo-router';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { pageSize, setPageSize, theme, setTheme, colors } = useSettings();
  const router = useRouter();

  const styles = createStyles(colors);
  const pathname = usePathname();
  console.log('SETTINGS montado, pathname:', pathname);

  return (
    <SafeAreaView style={styles.container}>
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

      <Text style={styles.settingsText}>Ajustes</Text>

      <View>
        <Text style={styles.titleSection}>     Producto por página</Text>
        <View style={styles.box}>
          {[5, 10, 15, 20, 25].map((n) => (
            <Pressable
              key={n}
              onPress={() => setPageSize(n)}
              style={[styles.options, n === pageSize && styles.activeOptions]}
            >
              <Text style={{ color: n === pageSize ? colors.white : colors.text}}>
                {n}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <View style={[styles.box, styles.switchBox]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {theme === 'dark' 
              ? <Moon color={colors.text} size={20} /> 
              : <Sun color={colors.text} size={20} />}
            <Text style={styles.titleSection}>Modo Oscuro</Text>
          </View>
          <Switch
            value={theme === "dark"}
            onValueChange={(v) => setTheme(v ? "dark" : "light")}
            trackColor={{ false: colors.lavender, true: colors.primaryDark }}
            thumbColor={colors.white}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  logoText: {
    fontSize: 20, fontWeight: '700', color: colors.text,
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  settingsText: {
    fontSize: 25, fontWeight: 'bold',
    marginHorizontal: 16, marginBottom: 5,
    color: colors.text,
  },
  titleSection: {
    fontWeight: 'bold', fontSize: 15, color: colors.text,
  },
  box: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  options: {
    width: 48, height: 40, borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  activeOptions: { backgroundColor: colors.primaryDark },
});