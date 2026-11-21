import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// 👇 Agregamos LayoutDashboard a los imports
import { User, Mail, AtSign, LogOut, ShoppingBag, Settings, LayoutDashboard, Pencil, Check, X } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import logo from '@/assets/images/joyeria/logo.jpeg';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  
  const { colors } = useSettings();
  const styles = createStyles(colors);

  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const handleLogout = () => {
    logout();
  };

  const startEditing = () => {
    if (!user) return;
    setEditFirstName(user.first_name);
    setEditLastName(user.last_name);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (!editFirstName.trim() || !editLastName.trim() || !editUsername.trim() || !editEmail.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editEmail.trim())) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }

    updateUser({
      first_name: editFirstName.trim(),
      last_name: editLastName.trim(),
      username: editUsername.trim(),
      email: editEmail.trim(),
    });
    setIsEditing(false);
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
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={logo} style={styles.avatar} resizeMode="cover" />
          </View>
          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>

        <View style={styles.infoCard}>
          
          <View style={styles.infoHeader}>
            <Text style={styles.sectionTitle}>Información personal</Text>
            {!isEditing && (
              <TouchableOpacity onPress={startEditing} style={styles.editIconBtn}>
                <Pencil color={colors.primaryDark} size={18} />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={editFirstName}
                onChangeText={setEditFirstName}
                placeholder="Nombre"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                value={editLastName}
                onChangeText={setEditLastName}
                placeholder="Apellido"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Usuario</Text>
              <TextInput
                style={styles.input}
                value={editUsername}
                onChangeText={setEditUsername}
                autoCapitalize="none"
                placeholder="usuario"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="correo@ejemplo.com"
                placeholderTextColor={colors.textSecondary}
              />

              <View style={styles.editActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={cancelEditing}>
                  <X color={colors.text} size={18} />
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
                  <Check color={colors.white} size={18} />
                  <Text style={styles.saveBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
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
            </>
          )}
        </View>

        {!isEditing && (
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
        )}

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
  
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
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

  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  cancelBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.primaryDark,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
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
  
  adminButton: {
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  adminIcon: {
    backgroundColor: colors.accent + '15',
  },
  adminText: {
    color: colors.accent,
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