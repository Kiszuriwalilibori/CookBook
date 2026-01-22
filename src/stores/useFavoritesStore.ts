import { create } from "zustand";

interface FavoritesState {
    favorites: Set<string>;
    hydrated: boolean;
    setFavorites: (ids: string[]) => void;
    add: (id: string) => void;
    remove: (id: string) => void;
    reset: () => void;
}

export const useFavoritesStore = create<FavoritesState>(set => ({
    favorites: new Set(),
    hydrated: false,

    setFavorites: ids =>
        set({
            favorites: new Set(ids),
            hydrated: true,
        }),

    add: id =>
        set(state => {
            const next = new Set(state.favorites);
            next.add(id);
            return { favorites: next };
        }),

    remove: id =>
        set(state => {
            const next = new Set(state.favorites);
            next.delete(id);
            return { favorites: next };
        }),

    reset: () => set({ favorites: new Set(), hydrated: false }),
}));
