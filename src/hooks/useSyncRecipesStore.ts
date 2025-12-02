import { useEffect } from "react";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { type Recipe } from "@/lib/types";

export function useSyncRecipesStore(initialRecipes: Recipe[]) {
    const { setRecipes } = useRecipesStore();

    useEffect(() => {
        setRecipes(initialRecipes);
    }, [initialRecipes, setRecipes]);
}
