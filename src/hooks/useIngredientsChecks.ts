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
            const key = getIngredientKey(recipeId, ingredient);

            return Boolean(checks[key]);
        },
        [checks, recipeId]
    );

    const toggle = useCallback(
        (ingredient: RecipeIngredient) => {
            const key = getIngredientKey(recipeId, ingredient);

            // zawsze pobieramy aktualny stan z localStorage
            const current = getStoredChecks();

            const updated = {
                ...current,
                [key]: !current[key],
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

            setChecks(updated);
        },
        [recipeId]
    );

    return {
        isChecked,
        toggle,
    };
}

export default useIngredientsChecks;
// test 3
