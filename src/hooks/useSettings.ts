import { SettingsContext } from "@/context/SettingsContext";
import { useContext } from "react";


export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error("useSettings debe usarse dentro de SettingsProvider");
    }
    return ctx; 
}
