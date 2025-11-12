"use client";

import { Grid, Box, Typography, Alert } from "@mui/material";
import { PageTitle, RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { type Recipe } from "@/lib/types";
import { useSyncRecipesStore } from "@/hooks";

export default function RecipesClient({ initialRecipes }: { initialRecipes: Recipe[] }) {
    const { recipes, loading, error } = useRecipesStore();

    useSyncRecipesStore(initialRecipes);

    const displayRecipes = recipes.length > 0 ? recipes : initialRecipes;

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
