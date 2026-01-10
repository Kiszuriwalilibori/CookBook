"use client";
import { useEffect } from "react";
import type { Recipe } from "@/types";

export function useHydrateSSR(initialRecipes: Recipe[], setDisplayRecipes: (recipes: Recipe[]) => void) {
    useEffect(() => {
        setDisplayRecipes(initialRecipes);
    }, [initialRecipes, setDisplayRecipes]);
}
