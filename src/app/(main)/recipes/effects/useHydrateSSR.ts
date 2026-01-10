"use client";
import { useEffect } from "react";
import type { Recipe } from "@/types";

export function useHydrateSSR(initialRecipes: Recipe[], setDisplayRecipes: (recipes: Recipe[]) => void) {
    useEffect(() => {
        console.log("[Effect 1: Hydration] hydrated with SSR data", {
            initialRecipesCount: initialRecipes.length,
        });
        setDisplayRecipes(initialRecipes);
    }, [initialRecipes, setDisplayRecipes]);
}
