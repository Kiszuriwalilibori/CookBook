// stores/useRecipesStore.ts
import { create } from "zustand";
import { type Recipe } from "@/lib/types";
import { type FilterState } from "@/types";

interface RecipesStore {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    fetchFilteredRecipes: (filters: Partial<FilterState>) => Promise<void>;
    setRecipes: (recipes: Recipe[]) => void;
}

export const useRecipesStore = create<RecipesStore>(set => ({
    recipes: [],
    loading: false,
    error: null,

    setRecipes: recipes => set({ recipes }),

    fetchFilteredRecipes: async filters => {
        try {
            set({ loading: true, error: null });
            console.log("filters", filters);
            const res = await fetch("/api/recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filters }),
            });

            if (!res.ok) throw new Error("Błąd podczas pobierania przepisów");

            const data = await res.json();
            console.log("data", data);
            set({ recipes: data, loading: false });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Nieznany błąd";
            console.error("Error fetching filtered recipes:", err);
            set({ loading: false, error: msg });
        }
    },
}));
