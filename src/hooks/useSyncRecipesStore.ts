import { useEffect } from "react";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { type Recipe } from "@/lib/types";

export function useSyncRecipesStore(initialRecipes: Recipe[]) {
    const { setRecipes } = useRecipesStore();

    useEffect(() => {
        if (initialRecipes.length > 0) {
            setRecipes(initialRecipes);
        }
    }, [initialRecipes, setRecipes]);
}
