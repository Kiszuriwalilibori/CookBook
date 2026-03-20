"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/types";

interface Props {
    recipes: Recipe[];
}

export default function LatestRecipesSection({ recipes }: Props) {
    if (!recipes?.length) return null;

    return (
        <Box
            sx={{
                backgroundColor: "#D6E2CF", // kontrastujące z #EAF0E1 i #A8BBA3
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ px: 2, pt: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Najnowsze
                </Typography>
            </Box>

            <Box
                sx={{
                    p: 2,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    flex: 1,
                }}
            >
                {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} isFavorite={false} onAddFavorite={() => {}} onRemoveFavorite={() => {}} />
                ))}
            </Box>
        </Box>
    );
}
