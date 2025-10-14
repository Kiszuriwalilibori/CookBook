// app/recipes/page.tsx (or pages/recipes.tsx—adjust based on your router)
"use client";

import { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import { getRecipesForCards } from "@/lib/sanity";
import { Recipe } from "@/lib/types";
import { PageTitle } from "@/components";
import RecipeCard from "@/components/RecipeCard"; // Adjust path to your RecipeCard
import { gridSize, pageContainerStyle } from "./styles";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRecipes() {
            try {
                setLoading(true);
                const data: Recipe[] = await getRecipesForCards();
                setRecipes(data);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                console.error("Error fetching recipes:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipes();
    }, []);

    if (loading) return <div>Loading recipes...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box sx={pageContainerStyle}>
            {/* Padding responsywny */}
            <PageTitle title="Przepisy" />
            <Grid container spacing={3}>
                {/* Spacing dla gap między kartami */}
                {recipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
