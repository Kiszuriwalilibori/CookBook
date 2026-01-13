
"use client";

import { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";

import { PageTitle, RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import { useIsAdminLogged } from "@/stores/useAdminStore";
import type { Recipe } from "@/types";
import { useAdminRefetch, useClearQueryParams, useHydrateSSR, useNonAdminRefetch } from "./effects";
import { useFavorites } from "@/hooks/useFavorites";

interface RecipesClientProps {
    initialRecipes: Recipe[];
}

export default function RecipesClient({ initialRecipes }: RecipesClientProps) {
    const isAdminLogged = useIsAdminLogged();
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    const { favorites, add, remove } = useFavorites();

    useHydrateSSR(initialRecipes, setDisplayRecipes);
    useNonAdminRefetch(isAdminLogged, setDisplayRecipes);
    useAdminRefetch(isAdminLogged, setDisplayRecipes);
    useClearQueryParams();

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
                        <RecipeCard recipe={recipe} isFavorite={favorites.has(recipe._id)} addFavorite={add} removeFavorite={remove} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
