"use client";

import { Box, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import { RecipeCard, ConfirmRemoveDialog } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import type { Recipe } from "@/types";
import { useFavorites } from "@/hooks";

import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { EmptyFavoritesMessage } from "./EmptyFavoritesMesage";
import { useRedirectIfNotLogged } from "@/hooks/useRedicrectIfNotLogged";

interface Props {
    initialRecipes: Recipe[];
}

export default function FavoritesClient({ initialRecipes }: Props) {
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);
    const handleRemoveFavorite = useCallback(
        async (recipe: Recipe) => {
            // Optimistic UI
            setDisplayRecipes(prev => prev.filter(r => r._id !== recipe._id));

            try {
                await removeFavorite(recipe._id);
            } catch (err) {
                // rollback
                setDisplayRecipes(prev => [...prev, recipe]);
                console.error("[FavoritesClient] Remove failed:", err);
            }
        },
        [removeFavorite]
    );
    // Hook confirm dialog
    const { isOpen, payload, loading: dialogLoading, openDialog, cancel, confirm } = useConfirmDialog<Recipe>({ onConfirm: handleRemoveFavorite });

    // CSR: redirect jeśli user wylogowany
    useRedirectIfNotLogged();

    if (displayRecipes.length === 0) {
        return <EmptyFavoritesMessage />;
    }

    return (
        <Box sx={pageContainerStyle}>
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard
                            recipe={recipe}
                            isFavorite={favorites.has(recipe._id)}
                            onAddFavorite={() => addFavorite(recipe._id)}
                            onRemoveFavorite={() => openDialog(recipe)} // <-- otwieramy dialog
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Dialog potwierdzenia */}
            {payload && <ConfirmRemoveDialog open={isOpen} loading={dialogLoading} title={payload.title} onCancel={cancel} onConfirm={confirm} />}
        </Box>
    );
}
