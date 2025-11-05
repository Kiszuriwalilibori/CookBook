import { useState, useEffect } from "react";
import { normalizeList, normalizeTags } from "@/components/RecipeFilters/utils/normalize";

interface OptionsState {
    titles: string[];
    cuisines: string[];
    tags: string[];
    dietaryRestrictions: string[];
    products: string[];
}

export const useRecipeFilterOptions = (): OptionsState => {
    const [options, setOptions] = useState<OptionsState>({
        titles: [],
        cuisines: [],
        tags: [],
        dietaryRestrictions: [],
        products: [],
    });

    useEffect(() => {
        Promise.all([
            fetch("/api/uniques/title").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/cuisine").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/tags").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/dietaryRestrictions").then(r => r.json()) as Promise<string[]>,
            fetch("/api/uniques/products").then(r => r.json()) as Promise<string[]>,
        ])
            .then(([titles, cuisines, tags, dietary, products]) => {
                setOptions({
                    titles: normalizeList(titles),
                    cuisines: normalizeList(cuisines),
                    tags: normalizeTags(tags),
                    dietaryRestrictions: normalizeList(dietary),
                    products: normalizeList(products),
                });
            })
            .catch(error => {
                console.error("Failed to fetch filter options:", error);
            });
    }, []);

    return options;
};
