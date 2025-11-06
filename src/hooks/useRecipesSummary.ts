// hooks/useRecipesSummary.ts
import { Options } from "@/types";
import { useState, useEffect } from "react";

interface HookReturn {
    summary: Options;
    isLoading: boolean;
    error: string | null;
}

export const useRecipesSummary = (initialSummary?: Options): HookReturn => {
    const [summary, setSummary] = useState<Options>(initialSummary || { titles: [], cuisines: [], tags: [], dietaryRestrictions: [], products: [] });
    const [isLoading, setIsLoading] = useState(!initialSummary); // Skip loading if hydrated
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialSummary) return; 

        setIsLoading(true);
        setError(null);
        fetch("/api/recipes-summary", { cache: "force-cache" })
            .then(r => r.json())
            .then(data => {
                setSummary({
                    titles: data.titles || [],
                    cuisines: data.cuisines || [],
                    tags: data.tags || [],
                    dietaryRestrictions: data.dietaryRestrictions || [],
                    products: data.products || [],
                });
            })
            .catch(err => {
                console.error("Failed to fetch recipes summary:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            })
            .finally(() => setIsLoading(false));
    }, [initialSummary]);

    return { summary, isLoading, error };
};
