"use client";
import { useEffect } from "react";
import type { Recipe } from "@/types";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { FilterState } from "@/models/filters";

export function useAdminRefetch(isAdminLogged: boolean, setDisplayRecipes: (recipes: Recipe[]) => void) {
    useEffect(() => {
        console.log("[Effect 3 START] isAdminLogged:", isAdminLogged);
        let cancelled = false;

        const refetch = async () => {
            try {
                const filters: Partial<FilterState> = isAdminLogged
                    ? {} // Admin sees everything
                    : { status: ["Good", "Acceptable"] }; // Non-admin default

                const fresh = await getRecipesForCards(filters, isAdminLogged);
                if (!cancelled) {
                    console.log("[Effect 3 FETCHED] count:", fresh.length);
                    setDisplayRecipes(fresh);
                }
            } catch (err) {
                console.error("[Effect 3] refetch failed:", err);
            }
        };

        refetch();

        return () => {
            cancelled = true;
            console.log("[Effect 3 CLEANUP]");
        };
    }, [isAdminLogged, setDisplayRecipes]);
}
