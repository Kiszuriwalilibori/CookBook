"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/types";
import { styles } from "./TopRatedRecipesSection.styles";

interface Props {
    recipes: Recipe[];
}

export default function TopRatedRecipesSection({ recipes }: Props) {
    if (!recipes?.length) return null;

    return (
        <Box sx={styles.container}>
            <Box sx={styles.headerBox}>
                <Typography variant="h5" sx={styles.headerText}>
                    Najwyżej oceniane
                </Typography>
            </Box>

            <Box sx={styles.gridContainer}>
                {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} isFavorite={false} onAddFavorite={() => {}} onRemoveFavorite={() => {}} />
                ))}
            </Box>
        </Box>
    );
}
