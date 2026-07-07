"use client";

import { Box, Checkbox, Typography } from "@mui/material";

import { Recipe } from "@/types";
import { styles } from "../styles";

import { useIngredientsChecks } from "@/hooks/useIngredientsChecks";

type Ingredient = NonNullable<Recipe["ingredients"]>[number];

interface RecipeIngredientItemProps {
    recipeId: string;
    ingredient: Ingredient;
}

function formatIngredient(ing: Ingredient): string {
    const rawUnit = ing.unit?.toLowerCase() || "";

    if (rawUnit === "szczypta") return "szczypta";
    if (rawUnit === "odrobina") return "odrobina";

    if (!ing.quantity) return "";

    const omitUnit = rawUnit.includes("sztuk");
    const unit = omitUnit ? "" : ing.unit || "";

    return `${ing.quantity}${unit ? ` ${unit}` : ""}`;
}

export function RecipeIngredientItem({ recipeId, ingredient }: RecipeIngredientItemProps) {
    const { isChecked, toggle } = useIngredientsChecks(recipeId);

    return (
        <Box component="li" role="listitem" sx={styles.ingredientsListItemFull}>
            <Checkbox
                sx={{
                    p: 0,
                    mr: 1,
                }}
                checked={isChecked(ingredient)}
                onChange={() => toggle(ingredient)}
                slotProps={{
                    input: {
                        "aria-label": `Dostępny składnik: ${ingredient.name}`,
                    },
                }}
            />

            <Typography sx={styles.ingredientsName}>{ingredient.name}</Typography>

            <Typography sx={styles.ingredientsQuantity}>{formatIngredient(ingredient)}</Typography>
        </Box>
    );
}
