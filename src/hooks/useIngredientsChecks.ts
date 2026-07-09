"use client";

import { useCallback, useEffect, useState } from "react";

import { RecipeIngredient } from "@/types";
import getIngredientKey from "@/utils/getIngredientKey";

type IngredientChecks = Record<string, boolean>;

const STORAGE_KEY = "recipe-ingredient-checks";

function getStoredChecks(): IngredientChecks {
    if (typeof window === "undefined") return {};

    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : {};
}

export function useIngredientsChecks(recipeId: string) {
    const [checks, setChecks] = useState<IngredientChecks>({});

    useEffect(() => {
        setChecks(getStoredChecks());
    }, []);

    const isChecked = useCallback(
        (ingredient: RecipeIngredient) => {
            return Boolean(checks[getIngredientKey(recipeId, ingredient)]);
        },
        [checks, recipeId]
    );

    const toggle = useCallback(
        (ingredient: RecipeIngredient) => {
            setChecks(prev => {
                const key = getIngredientKey(recipeId, ingredient);

                const updated = {
                    ...prev,
                    [key]: !prev[key],
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

                return updated;
            });
        },
        [recipeId]
    );

    return {
        isChecked,
        toggle,
    };
}
export default useIngredientsChecks;
