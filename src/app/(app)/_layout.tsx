import { colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import { Heart, Home, Settings } from "lucide-react-native";

export default function AppLayout(){
  return(
    <Tabs
      screenOptions = {{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarStyle: { backgroundColor: colors.surface },  
      }}
    >
      <Tabs.Screen
      name="index"
      options={{
        title: 'Inicio',
        tabBarIcon: ({ color, size}) => <Home color={color} size={size} />
      }}
      />
       <Tabs.Screen
      name="favorites"
      options={{
        title: 'Favoritos',
        tabBarIcon: ({ color, size}) => <Heart color={color} size={size} />
      }}
      />
       <Tabs.Screen
      name="settings"
      options={{
        title: 'Ajustes',
        tabBarIcon: ({ color, size }) => <Settings color={color} size={size} 
        />
      }}
      />
    </Tabs>
  );
}