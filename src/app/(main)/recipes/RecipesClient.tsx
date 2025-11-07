"use client";

import { useEffect } from "react";
import { Grid, Box, Typography, Alert } from "@mui/material";
import { PageTitle } from "@/components";
import RecipeCard from "@/components/RecipeCard";
import { gridSize, pageContainerStyle } from "./styles";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { type Recipe } from "@/lib/types";

export default function RecipesClient({ initialRecipes }: { initialRecipes: Recipe[] }) {
    const { recipes, setRecipes, loading, error } = useRecipesStore();
    if (recipes) {
        console.log(recipes, "recipes");
    }
    // hydrate store with SSR data
    useEffect(() => {
        setRecipes(initialRecipes);
    }, [initialRecipes, setRecipes]);

    if (loading) {
        return (
            <Box sx={pageContainerStyle}>
                <Typography textAlign="center" mt={4}>
                    Ładowanie…
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={pageContainerStyle}>
                <Alert severity="error" sx={{ maxWidth: 600 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!recipes || recipes.length === 0) {
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
                {recipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
