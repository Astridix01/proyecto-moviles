import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useSettings } from "@/hooks/useSettings";
import { Tabs } from "expo-router";
import { Heart, Home, ShoppingBag, User } from "lucide-react-native";

export default function AppLayout() {
  const { colors } = useSettings();
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { favoriteIds } = useFavorites();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { 
          backgroundColor: colors.surface,
          borderTopColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen 
        name="cart" 
        options={{ 
          title: 'Carrito',
          tabBarIcon: ({ color }) => <ShoppingBag color={color} size={24} />,
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.accent,
            color: colors.white,
            fontSize: 11,
            fontWeight: 'bold',
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
        }} 
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          tabBarBadge: favoriteIds.length > 0 ? favoriteIds.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.surface2,
            color: colors.white,
            fontSize: 11,
            fontWeight: 'bold',
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }} 
      />

      {user?.role === 'admin' && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarItemStyle: { display: 'none' },
          }}
        />
      )}

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}