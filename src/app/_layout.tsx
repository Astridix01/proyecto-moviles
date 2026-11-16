import { FavoritesProvider } from "@/context/FavoritesContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FavoritesProvider>
    </SettingsProvider>
  );
}


