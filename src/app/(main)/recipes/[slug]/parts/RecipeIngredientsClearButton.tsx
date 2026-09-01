"use client";

import Button from "@mui/material/Button";

import { useIngredientChecksStore } from "@/stores";
import { clearButton } from "./RecipeIngredientsClearButton.styles";

interface Props {
    recipeId: string;
}

export function RecipeIngredientsClearButton({ recipeId }: Props) {
    const clearRecipe = useIngredientChecksStore(state => state.clearRecipe);
    const checks = useIngredientChecksStore(state => state.checks);
    const hasCheckedIngredients = Object.entries(checks).some(([key, checked]) => key.startsWith(`${recipeId}-`) && checked);

    return (
        <Button variant="contained" color="secondary" onClick={() => clearRecipe(recipeId)} disabled={!hasCheckedIngredients} sx={clearButton}>
            Odznacz wszystkie
        </Button>
    );
}
