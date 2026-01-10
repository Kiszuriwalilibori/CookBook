"use client";
import { useEffect } from "react";
import type { Recipe } from "@/types";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { FilterState } from "@/models/filters";

export function useNonAdminRefetch(isAdminLogged: boolean, setDisplayRecipes: (recipes: Recipe[]) => void) {
    useEffect(() => {
        if (!isAdminLogged) {
            let cancelled = false;

            const refetch = async () => {
                try {
                    const filters: Partial<FilterState> = { status: ["Good", "Acceptable"] };
                    const fresh = await getRecipesForCards(filters, isAdminLogged);
                    if (!cancelled) {
                        setDisplayRecipes(fresh);
                    }
                } catch (err) {
                    console.error("useNonAdmin refetch failed:", err);
                }
            };

            refetch();

            return () => {
                cancelled = true;
            };
        }
    }, [isAdminLogged, setDisplayRecipes]);
}
