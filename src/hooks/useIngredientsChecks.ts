"use client";

import { useCallback, useEffect, useState } from "react";

import { Recipe } from "@/types";
import getIngredientKey from "@/utils/getIngredientKey";

type Ingredient = NonNullable<Recipe["ingredients"]>[number];

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
        (ingredient: Ingredient) => {
            return Boolean(checks[getIngredientKey(recipeId, ingredient)]);
        },
        [checks, recipeId]
    );

    const toggle = useCallback(
        (ingredient: Ingredient) => {
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
