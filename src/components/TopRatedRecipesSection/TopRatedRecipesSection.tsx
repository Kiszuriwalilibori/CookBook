import React from "react";
import { Box, Typography } from "@mui/material";
import RecipeCard from "@/components/RecipeCard";

import { styles } from "./TopRatedRecipesSection.styles";
import getTopRatedRecipes from "@/utils/getTopRatedRecipes";

export default async function TopRatedRecipesSection() {
    try {
        const recipes = await getTopRatedRecipes(6);
        if (!recipes?.length) return null;

        return (
            <Box sx={styles.gridContainer}>
                {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
            </Box>
        );
    } catch {
        return <Typography>Nie udało się pobrać najwyżej ocenianych przepisów.</Typography>;
    }
}
