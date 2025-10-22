"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid, Box, CircularProgress, Alert, Button, Typography } from "@mui/material";
import { getRecipesForCards } from "@/lib/sanity";
import { Recipe } from "@/lib/types";
import { PageTitle } from "@/components";
import RecipeCard from "@/components/RecipeCard";
import { gridSize, pageContainerStyle } from "./styles";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data: Recipe[] = await getRecipesForCards();
            setRecipes(data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            setError(errorMessage);
            console.error("Error fetching recipes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    // Dynamically compute grid size based on recipe count
    const getGridSize = (count: number) => {
        if (count === 1) return { xs: 12 }; // Full width, single column
        if (count === 2) return { xs: 12, sm: 6 }; // Stack on xs, two cols on sm+
        return gridSize; // Default for 3+ (e.g., 3 cols)
    };

    if (loading)
        return (
            <Box sx={pageContainerStyle} display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Ładowanie przepisów...
                </Typography>
            </Box>
        );

    if (error)
        return (
            <Box sx={pageContainerStyle} display="flex" flexDirection="column" alignItems="center" gap={2} p={4}>
                <Alert severity="error" sx={{ maxWidth: 600 }}>
                    Błąd: {error}
                </Alert>
                <Button variant="outlined" onClick={fetchRecipes}>
                    Ponów próbę
                </Button>
            </Box>
        );

    return (
        <Box sx={pageContainerStyle}>
            <PageTitle title="Przepisy" />
            {recipes.length > 0 ? (
                recipes.length === 1 ? (
                    // Special case: Single recipe, explicitly centered
                    <Grid container spacing={3} justifyContent="center">
                        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <RecipeCard recipe={recipes[0]} />
                        </Grid>
                    </Grid>
                ) : (
                    // Multi-recipe: Dynamic grid with centering
                    <Grid container spacing={3} justifyContent="center">
                        {recipes.map(recipe => (
                            <Grid size={getGridSize(recipes.length)} key={recipe._id}>
                                <RecipeCard recipe={recipe} />
                            </Grid>
                        ))}
                    </Grid>
                )
            ) : (
                <Typography variant="h6" textAlign="center" mt={4}>
                    Brak przepisów do wyświetlenia.
                </Typography>
            )}
        </Box>
    );
}
