"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import type { Recipe } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";

interface Props {
    initialRecipes: Recipe[];
}

export default function FavoritesClient({ initialRecipes }: Props) {
    const { favorites, addFavorite, removeFavorite, loading } = useFavorites();
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    if (displayRecipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <Typography variant="h6" textAlign="center" mt={4}>
                    Nie masz jeszcze ulubionych przepisów.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={pageContainerStyle}>
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard
                            recipe={recipe}
                            isFavorite={favorites.has(recipe._id)}
                            loading={loading}
                            removeFavorite={async () => {
                                // 🔥 optimistic removal
                                setDisplayRecipes(prev => prev.filter(r => r._id !== recipe._id));

                                try {
                                    await removeFavorite(recipe._id);
                                } catch {
                                    // rollback (opcjonalnie)
                                    setDisplayRecipes(prev => [...prev, recipe]);
                                }
                            }}
                            addFavorite={() => addFavorite(recipe._id)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
