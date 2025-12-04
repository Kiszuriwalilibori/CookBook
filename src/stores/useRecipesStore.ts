// useRecipesStore.ts
import { create } from "zustand";
import type { Recipe } from "@/types";

interface RecipesStore {
    recipes: Recipe[];
    hydrated: boolean;
    hydrate: (recipes: Recipe[]) => void;
    setRecipes: (recipes: Recipe[]) => void;
}

export const useRecipesStore = create<RecipesStore>(set => ({
    recipes: [],
    hydrated: false,

    hydrate: recipes => set(state => (state.hydrated ? state : { recipes, hydrated: true })),

    setRecipes: recipes => set({ recipes }),
}));
