"use client";

import { useEffect, useState } from "react";
import { getOptions } from "@/utils/getOptions";
import { EMPTY_RECIPE_FILTER, type RecipeFilter } from "@/types";
import { useAdminStore } from "@/stores";

interface RecipesSummaryState {
    summary: RecipeFilter;
    isLoading: boolean;
    error: string | null;
}

export function useRecipesSummary(initialSummary?: RecipeFilter) {
    const [summary, setSummary] = useState<RecipeFilter>(initialSummary ?? EMPTY_RECIPE_FILTER);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAdminLogged = useAdminStore(state => state.isAdminLogged);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setIsLoading(true);

                const { fullSummary, publicSummary, sanitizeIssues } = await getOptions();

                // Choose summary based on admin mode
                setSummary(isAdminLogged ? fullSummary : publicSummary);

                // Handle sanitize warnings
                if (sanitizeIssues.length > 0) {
                    console.warn("⚠️ Faulty values found in recipes summary:", sanitizeIssues);
                    setError("Niektóre dane zawierały błędy i zostały oczyszczone.");
                } else {
                    setError(null);
                }
            } catch (err) {
                console.error("Failed to load recipes summary:", err);
                setError("Nie udało się pobrać podsumowania przepisów");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [initialSummary, isAdminLogged]);

    return { summary, isLoading, error } satisfies RecipesSummaryState;
}
