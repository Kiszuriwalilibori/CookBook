"use client";

import React, { useCallback } from "react";

import type { Recipe } from "@/types";

import { useFavorites } from "@/hooks";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

import ConfirmRemoveDialog from "../ConfirmRemoveDialog";

import { RecipeCardPresentation } from "./RecipeCard.Presentation";

import { urlFor } from "../../lib/sanity/imageUrl";

interface RecipeCardContainerProps {
    recipe: Recipe;
    onRemoved?: (recipeId: string) => void;
}

export const RecipeCardContainer = React.memo(function RecipeCardContainer({ recipe, onRemoved }: RecipeCardContainerProps) {
    const { isFavorite, addFavorite, removeFavorite, isLoading } = useFavorites(recipe._id);

    const handleRemoveFavorite = useCallback(async () => {
        await removeFavorite();
        onRemoved?.(recipe._id);
    }, [onRemoved, recipe._id, removeFavorite]);

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

    const imageUrl = recipe.description?.image ? urlFor(recipe.description.image).url() : "/placeholder-image.jpg";

    const handleFavorite = useCallback(() => {
        if (isLoading) {
            return;
        }

        if (isFavorite) {
            openDialog(recipe);
            return;
        }

        addFavorite();
    }, [addFavorite, isFavorite, isLoading, openDialog, recipe]);

    return (
        <>
            <RecipeCardPresentation recipe={recipe} isFavorite={isFavorite} imageUrl={imageUrl} onFavorite={handleFavorite} />

            {payload && <ConfirmRemoveDialog open={isOpen} loading={dialogLoading} title={payload.title} onCancel={cancel} onConfirm={confirm} />}
        </>
    );
});
