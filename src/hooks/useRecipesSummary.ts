// import { useState, useEffect } from "react";

// interface OptionsState {
//     titles: string[];
//     cuisines: string[];
//     tags: string[];
//     dietaryRestrictions: string[];
//     products: string[];
// }

// export const useRecipesSummary = (): OptionsState => {
//     const [options, setOptions] = useState<OptionsState>({
//         titles: [],
//         cuisines: [],
//         tags: [],
//         dietaryRestrictions: [],
//         products: [],
//     });

//     useEffect(() => {
//         fetch("/api/recipes-summary")
//             .then(r => r.json())
//             .then(data => {
//                 setOptions({
//                     titles: data.titles || [],
//                     cuisines: data.cuisines || [],
//                     tags: data.tags || [],
//                     dietaryRestrictions: data.dietaryRestrictions || [],
//                     products: data.products || [],
//                 });
//             })
//             .catch(error => {
//                 console.error("Failed to fetch recipes summary:", error);
//             });
//     }, []);

//     return options;
// };
// hooks/useRecipesSummary.ts (updated)
import { useState, useEffect } from "react";

interface OptionsState {
    titles: string[];
    cuisines: string[];
    tags: string[];
    dietaryRestrictions: string[];
    products: string[];
}

interface HookReturn {
    summary: OptionsState;
    isLoading: boolean;
    error: string | null;
}

export const useRecipesSummary = (initialSummary?: OptionsState): HookReturn => {
    const [summary, setSummary] = useState<OptionsState>(
        initialSummary || { titles: [], cuisines: [], tags: [], dietaryRestrictions: [], products: [] }
    );
    const [isLoading, setIsLoading] = useState(!initialSummary); // Skip loading if hydrated
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialSummary) return; // Already hydrated, no fetch needed

        setIsLoading(true);
        setError(null);
        fetch("/api/recipes-summary", { cache: 'force-cache' }) // Cache for performance
            .then(r => r.json())
            .then((data) => {
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