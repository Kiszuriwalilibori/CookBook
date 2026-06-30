"use client";

import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";

import { PageTitle, RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import { ConfirmRemoveDialog } from "@/components";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useCallback } from "react";

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
    const { isLoading } = useFavorites();

    useHydrateSSR(initialRecipes, setDisplayRecipes);
    useNonAdminRefetch(setDisplayRecipes);
    useAdminRefetch(setDisplayRecipes);

    const { hydrated, setFavorites } = useFavoritesStore();

    useEffect(() => {
        if (!hydrated && initialFavorites.length > 0) {
            setFavorites(initialFavorites);
        }
    }, [hydrated, initialFavorites, setFavorites]);

    const { addFavorite, removeFavorite } = useFavorites();
    const handleRemoveFavorite = useCallback(
        async (recipe: Recipe) => {
            await removeFavorite(recipe._id);
        },
        [removeFavorite]
    );
    const {
        isOpen,
        payload,
        loading: dialogLoading,
        openDialog,
        cancel,
        confirm,
    } = useConfirmDialog<Recipe>({
        onConfirm: handleRemoveFavorite,
    });

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
                        <RecipeCard loading={isLoading(recipe._id)} recipe={recipe} onAddFavorite={addFavorite} onRemoveFavorite={() => openDialog(recipe)} />
                    </Grid>
                ))}
            </Grid>
            {payload && <ConfirmRemoveDialog open={isOpen} loading={dialogLoading} title={payload.title} onCancel={cancel} onConfirm={confirm} />}
        </Box>
    );
}
