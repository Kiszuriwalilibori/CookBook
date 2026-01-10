"use client";
import { useEffect } from "react";
import type { Recipe } from "@/types";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { FilterState } from "@/models/filters";

export function useAdminRefetch(isAdminLogged: boolean, setDisplayRecipes: (recipes: Recipe[]) => void) {
    useEffect(() => {
        let cancelled = false;

        const refetch = async () => {
            try {
                const filters: Partial<FilterState> = isAdminLogged
                    ? {} // Admin sees everything
                    : { status: ["Good", "Acceptable"] }; // Non-admin default

                const fresh = await getRecipesForCards(filters, isAdminLogged);
                if (!cancelled) {
                    setDisplayRecipes(fresh);
                }
            } catch (err) {
                console.error("useAdmin refetch failed:", err);
            }
        };

        refetch();

        return () => {
            cancelled = true;
        };
    }, [isAdminLogged, setDisplayRecipes]);
}
