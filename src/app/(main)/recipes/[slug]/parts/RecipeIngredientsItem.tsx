"use client";

import { Box, Checkbox, Typography } from "@mui/material";

import { RecipeIngredient } from "@/types";
import { styles } from "../styles";
import { useIngredientChecksStore } from "@/stores";

import getIngredientKey from "@/utils/getIngredientKey";

interface RecipeIngredientItemProps {
    recipeId: string;
    ingredient: RecipeIngredient;
}

function formatIngredient(ingredient: RecipeIngredient): string {
    const rawUnit = ingredient.unit?.toLowerCase() || "";

    if (rawUnit === "szczypta") return "szczypta";
    if (rawUnit === "odrobina") return "odrobina";

    if (!ingredient.quantity) return "";

    const omitUnit = rawUnit.includes("sztuk");
    const unit = omitUnit ? "" : ingredient.unit || "";

    return `${ingredient.quantity}${unit ? ` ${unit}` : ""}`;
}

export function RecipeIngredientItem({ recipeId, ingredient }: RecipeIngredientItemProps) {
    // const { isChecked, toggle } = useIngredientsChecks(recipeId);
    const key = getIngredientKey(recipeId, ingredient);

    const checked = useIngredientChecksStore(state => state.checks[key] ?? false);

    const toggle = useIngredientChecksStore(state => state.toggle);

    return (
        <Box component="li" role="listitem" sx={styles.ingredientsListItemFull}>
            <Checkbox
                sx={{
                    p: 0,
                    mr: 1,
                }}
                checked={checked}
                onChange={() => toggle(key)}
                // checked={isChecked(ingredient)}
                // onChange={() => toggle(ingredient)}
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
