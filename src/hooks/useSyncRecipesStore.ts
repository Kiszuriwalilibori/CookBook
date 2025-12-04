import { useEffect } from "react";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { type Recipe } from "@/types";

export function useSyncRecipesStore(initialRecipes: Recipe[]) {
    const { setRecipes } = useRecipesStore();

    useEffect(() => {
        setRecipes(initialRecipes);
    }, [initialRecipes, setRecipes]);
}
