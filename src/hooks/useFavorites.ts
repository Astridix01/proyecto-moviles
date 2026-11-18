import { FavoritesContext } from "@/context/FavoritesContext";
import { useContext } from "react";


export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) {
        throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
    }
    return ctx;
}


