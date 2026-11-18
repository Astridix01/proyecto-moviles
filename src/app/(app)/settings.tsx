//TIENE ESTO PARA QUE NO ESTE VACIO CHECAR DESPUES 
import logo from '@/assets/images/joyeria/logo.jpeg';
import { colors } from "@/constants/colors";
import { useSettings } from '@/hooks/useSettings';
import { Moon } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { pageSize, setPageSize, theme, setTheme } = useSettings();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.barra}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Image source={logo} style={styles.imagen} resizeMode="cover" />
          </View>
          <Text style={styles.logoText}>Yatzari</Text>
        </View>
      </View>

      <View>
        <Text style ={styles.settingsText}>Ajustes</Text>
      </View>

      <View>
        <Text style={styles.titleSection}>Productos por página</Text>
        <View style={styles.box}>
          {[2, 4, 6, 8, 10].map((n) => (
            <Pressable key={n} onPress={() => setPageSize(n)} style={[styles.options, n === pageSize && styles.activeOptions]}>
              <Text>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <View style={styles.box}>
          <Moon color={colors.text} size={20}/>
          <Text style={styles.titleSection} > Modo Oscuro</Text>
          <Switch 
            value={theme === "dark"}
            onValueChange={(v) => setTheme(v ? "dark" : "light")}
            trackColor={{ false: colors.lavender, true: colors.primaryDark }}
            thumbColor={colors.lavender}
            
          />
        </View>
      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,

  },

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

  box: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,

  },
  titleSection: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 8,

  },

  options: {
    width: 48,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeOptions: {
    backgroundColor: colors.primaryDark,
  },

  settingsText:{
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 5,
  }

})