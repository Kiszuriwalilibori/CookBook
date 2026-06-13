import React from "react";
import { Box, Typography } from "@mui/material";
import RecipeCard from "@/components/RecipeCard";

import { styles } from "./LatestRecipeSection.styles";
import getLatestRecipes from "@/utils/getLatestRecipes";

export default async function LatestRecipesSection() {
    try {
        const recipes = await getLatestRecipes(6);
        //    test only

        if (!recipes?.length) return null;

        return (
            <Box sx={styles.gridContainer}>
                {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} isFavorite={false} />
                ))}
            </Box>
        );
    } catch {
        return <Typography>Nie udało się pobrać najnowszych przepisów.</Typography>;
    }
}
