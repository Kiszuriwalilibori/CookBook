"use client";

import { create } from "zustand";

// Typ danych dla ulubionych
export interface Favorite {
    recipeId: string;
    userId: string;
}

// Typ stanu store
interface FavoritesState {
    favorites: Set<string>; // przechowujemy tylko recipeId dla szybkiego lookup
    setFavorites: (ids: string[]) => void;
    addFavorite: (recipeId: string) => void;
    removeFavorite: (recipeId: string) => void;
}

// Store
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: new Set(),

    setFavorites: (ids: string[]) => {
        set({ favorites: new Set(ids) });
    },

    addFavorite: (recipeId: string) => {
        const current = new Set(get().favorites);
        current.add(recipeId);
        set({ favorites: current });
    },

    removeFavorite: (recipeId: string) => {
        const current = new Set(get().favorites);
        current.delete(recipeId);
        set({ favorites: current });
    },
}));
