"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type IngredientChecks = Record<string, boolean>;

interface IngredientChecksStore {
    checks: IngredientChecks;

    toggle: (key: string) => void;

    clearAll: () => void;

    clearRecipe: (recipeId: string) => void;
}

export const useIngredientChecksStore = create<IngredientChecksStore>()(
    persist(
        set => ({
            checks: {},

            toggle: key =>
                set(state => ({
                    checks: {
                        ...state.checks,
                        [key]: !state.checks[key],
                    },
                })),

            clearAll: () =>
                set({
                    checks: {},
                }),

            clearRecipe: recipeId =>
                set(state => ({
                    checks: Object.fromEntries(Object.entries(state.checks).filter(([key]) => !key.startsWith(`${recipeId}-`))),
                })),
        }),
        {
            name: "recipe-ingredient-checks",
        }
    )
);
