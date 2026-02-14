"use client";

import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";

import { PageTitle, RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";

import type { Recipe } from "@/types";
import { useAdminRefetch, useHydrateSSR, useNonAdminRefetch } from "./effects";

import { useFavorites } from "@/hooks/useFavorites";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

interface RecipesClientProps {
    initialRecipes: Recipe[];
    initialFavorites: string[];
}

export default function RecipesClient({ initialRecipes, initialFavorites }: RecipesClientProps) {
    

    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    useHydrateSSR(initialRecipes, setDisplayRecipes);
    useNonAdminRefetch(setDisplayRecipes);
    useAdminRefetch(setDisplayRecipes);
    // useClearQueryParams();

    const { hydrated, setFavorites } = useFavoritesStore();

    useEffect(() => {
        if (!hydrated && initialFavorites.length > 0) {
            setFavorites(initialFavorites);
        }
    }, [hydrated, initialFavorites, setFavorites]);

    const { favorites, addFavorite, removeFavorite } = useFavorites();

    if (displayRecipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <PageTitle title="Przepisy" />
                <Typography variant="h6" textAlign="center" mt={4}>
                    Brak przepisów do wyświetlenia.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={pageContainerStyle}>
            <PageTitle title="Przepisy" />
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard recipe={recipe} isFavorite={favorites.has(recipe._id)} onAddFavorite={addFavorite} onRemoveFavorite={removeFavorite} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
