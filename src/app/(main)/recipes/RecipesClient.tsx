"use client";

import { Grid, Box, Typography } from "@mui/material";
import { PageTitle, RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { type Recipe } from "@/lib/types";
import { useEffect } from "react";

export default function RecipesClient({ initialRecipes }: { initialRecipes: Recipe[] }) {
    const { recipes, hydrated, hydrate, setRecipes } = useRecipesStore();

    useEffect(() => {
        if (!hydrated) {
            // initial SSR hydration: set recipes and mark hydrated
            hydrate(initialRecipes);
            return;
        }
        // subsequent server responses (e.g. after router.push with new searchParams)
        // should replace current recipes in store
        setRecipes(initialRecipes);
    }, [initialRecipes, hydrated, hydrate, setRecipes]);

    const displayRecipes = recipes;

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
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
