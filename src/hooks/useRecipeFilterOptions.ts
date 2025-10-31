// hooks/useRecipeFilterOptions.ts
import { useState, useEffect } from "react";

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
        ]).then(([titles, cuisines, tags, dietary, products]) => {
            const normalizeList = (arr: string[]) => [...new Set(arr.map(i => i.toLowerCase()))].sort((a, b) => a.localeCompare(b, "pl"));

            const processedTags = Array.from(
                new Set(
                    tags
                        .flatMap(tag =>
                            tag
                                .split(",")
                                .map(t => t.trim().toLowerCase())
                                .filter(Boolean)
                        )
                        .sort((a, b) => a.localeCompare(b, "pl"))
                )
            );

            setOptions({
                titles: normalizeList(titles),
                cuisines: normalizeList(cuisines),
                tags: processedTags,
                dietaryRestrictions: normalizeList(dietary),
                products: normalizeList(products),
            });
        });
    }, []);

    return options;
};
