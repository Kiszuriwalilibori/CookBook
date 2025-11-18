"use client";

import { useEffect, useState } from "react";
import { getRecipesSummary } from "@/lib/getRecipesSummary";
import type { Options } from "@/types";

interface RecipesSummaryState {
    summary: Options;
    isLoading: boolean;
    error: string | null;
}

export function useRecipesSummary(initialSummary?: Options) {
    const [summary, setSummary] = useState<Options>(
        initialSummary || {
            titles: [],
            cuisines: [],
            tags: [],
            dietary: [],
            products: [],
        }
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setIsLoading(true);
                const { sanitizedSummary, sanitizeIssues } = await getRecipesSummary();
                setSummary(sanitizedSummary);
                if (sanitizeIssues.length > 0) {
                    console.warn("⚠️ Faulty values found in recipes summary:", sanitizeIssues);
                    setError("Niektóre dane zawierały błędy i zostały oczyszczone.");
                }
                setError(null);
            } catch (err) {
                console.error("Failed to load recipes summary:", err);
                setError("Nie udało się pobrać podsumowania przepisów");
            } finally {
                setIsLoading(false);
            }
        };

        /*if (!initialSummary)*/ fetchSummary();
    }, [initialSummary]);

    return { summary, isLoading, error } as RecipesSummaryState;
}
