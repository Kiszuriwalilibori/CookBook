"use client";

import Button from "@mui/material/Button";

import { useIngredientChecksStore } from "@/stores";

interface Props {
    recipeId: string;
}

export function RecipeIngredientsClearButton({ recipeId }: Props) {
    const clearRecipe = useIngredientChecksStore(state => state.clearRecipe);

    return <Button onClick={() => clearRecipe(recipeId)}>Odznacz wszystkie</Button>;
}
