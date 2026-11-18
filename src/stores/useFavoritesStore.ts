import { create } from "zustand";

interface FavoritesState {
    favorites: Set<string>;
    hydrated: boolean;
    areFavoritesEmpty: boolean;
    setFavorites: (favoriteIds: string[]) => void;
    add: (favoriteId: string) => void;
    remove: (favoriteId: string) => void;
    reset: () => void;
}

export const useFavoritesStore = create<FavoritesState>(set => ({
    favorites: new Set(),
    hydrated: false,
    areFavoritesEmpty: true,

    setFavorites: favoriteIds =>
        set({
            favorites: new Set(favoriteIds),
            hydrated: true,
            areFavoritesEmpty: favoriteIds.length === 0,
        }),

    add: favoriteId =>
        set(state => {
            const next = new Set(state.favorites);
            next.add(favoriteId);
            return {
                favorites: next,
                areFavoritesEmpty: next.size === 0,
            };
        }),

    remove: favoriteId =>
        set(state => {
            const next = new Set(state.favorites);
            next.delete(favoriteId);
            return {
                favorites: next,
                areFavoritesEmpty: next.size === 0,
            };
        }),

    reset: () =>
        set({
            favorites: new Set(),
            hydrated: false,
            areFavoritesEmpty: true,
        }),
}));
export const useGetFavorites = () => useFavoritesStore(state => state.favorites);

export const useIsFavorite = (recipeId: string) => useFavoritesStore(state => state.favorites.has(recipeId));

export const useFavoritesHydrated = () => useFavoritesStore(state => state.hydrated);

export const useAreFavoritesEmpty = () => useFavoritesStore(state => state.areFavoritesEmpty);

export const useFavoritesActions = () =>
    useFavoritesStore(state => ({
        setFavorites: state.setFavorites,
        add: state.add,
        remove: state.remove,
        reset: state.reset,
    }));
