import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// 👇 Agregamos LayoutDashboard a los imports
import { User, Mail, AtSign, LogOut, ShoppingBag, Settings, LayoutDashboard } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import logo from '@/assets/images/joyeria/logo.jpeg';

export default function Profile() {
  const { user, logout } = useAuth();
  
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noUserText}>No has iniciado sesión</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header con Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={logo} style={styles.avatar} resizeMode="cover" />
          </View>
          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>

        {/* Tarjeta de Información */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información personal</Text>
          
          <View style={styles.infoRow}>
            <User color={colors.primaryDark} size={20} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Nombre completo</Text>
              <Text style={styles.infoValue}>{user.first_name} {user.last_name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <AtSign color={colors.primaryDark} size={20} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Usuario</Text>
              <Text style={styles.infoValue}>{user.username}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Mail color={colors.primaryDark} size={20} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Correo electrónico</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/')}>
            <View style={styles.actionIcon}>
              <ShoppingBag color={colors.text} size={22} />
            </View>
            <Text style={styles.actionText}>Seguir comprando</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.navigate('/settings')}>
            <View style={styles.actionIcon}>
              <Settings color={colors.text} size={22} />
            </View>
            <Text style={styles.actionText}>Configuración</Text>
          </TouchableOpacity>

          {/* 👇 BOTÓN CONDICIONAL PARA ADMINISTRADORES */}
          {user.role === 'admin' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.adminButton]} 
              onPress={() => router.navigate('/admin')}
            >
              <View style={[styles.actionIcon, styles.adminIcon]}>
                <LayoutDashboard color={colors.accent} size={22} />
              </View>
              <Text style={[styles.actionText, styles.adminText]}>
                Panel de Administrador
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <View style={[styles.actionIcon, styles.logoutIcon]}>
              <LogOut color={colors.error} size={22} />
            </View>
            <Text style={[styles.actionText, styles.logoutText]}>Cerrar sesión</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// 👇 Generador de estilos dinámicos
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  noUserText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.primaryDark,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryDark + '20',
    marginVertical: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  
  // 👇 NUEVOS ESTILOS PARA EL BOTÓN DE ADMIN
  adminButton: {
    borderWidth: 1,
    borderColor: colors.accent + '40', // Un borde dorado sutil
  },
  adminIcon: {
    backgroundColor: colors.accent + '15', // Fondo dorado muy sutil
  },
  adminText: {
    color: colors.accent, // Texto en dorado
  },

  logoutButton: {
    backgroundColor: colors.surface,
  },
  logoutIcon: {
    backgroundColor: colors.error + '15',
  },
  logoutText: {
    color: colors.error,
  },
});