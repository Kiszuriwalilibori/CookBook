"use client";

import { Box, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import { RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import type { Recipe } from "@/types";

import { EmptyFavoritesMessage } from "./EmptyFavoritesMesage";

interface Props {
    initialRecipes: Recipe[];
}

export default function FavoritesClient({ initialRecipes }: Props) {
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);
    const handleRemoved = useCallback((recipeId: string) => {
        setDisplayRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
    }, []);

    // Hook confirm dialog

    if (displayRecipes.length === 0) {
        return <EmptyFavoritesMessage />;
    }

    return (
        <Box sx={pageContainerStyle}>
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard recipe={recipe} onRemoved={handleRemoved} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
