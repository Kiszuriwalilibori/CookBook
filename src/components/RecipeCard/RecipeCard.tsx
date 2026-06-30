// "use client";

// import React from "react";
// import { Card, CardContent, Box } from "@mui/material";
// import NextLink from "next/link";
// import { styles } from "./styles";
// import Separator from "../Common/Separator/Separator";
// import type { Recipe } from "@/types";
// import { RecipeCardDescription } from "./RecipeCard.Description";
// import { RecipeCardTitle } from "./RecipeCard.Title";
// import { RecipeCardImage } from "./RecipeCard.Image";
// import { RecipeCardFavoriteButton } from "./RecipeCard.FavoriteButton";
// import { useIsFavorite } from "@/stores/useFavoritesStore";

// interface RecipeCardProps {
//     recipe: Recipe;
//     loading?: boolean;
//     onAddFavorite?: (id: string) => void;
//     onRemoveFavorite?: (id: string) => void;
// }

// export const RecipeCard = React.memo(function RecipeCard({ loading, recipe, onAddFavorite, onRemoveFavorite }: RecipeCardProps) {
//     const { title, description, slug } = recipe;
//     const isFavorite = useIsFavorite(recipe._id);

//     const imageUrl = description?.image?.asset?.url || "/placeholder-image.jpg";
//     const handleFavorite = (e: React.MouseEvent) => {
//         e.preventDefault();
//         if (!onAddFavorite || !onRemoveFavorite) return;
//         if (isFavorite) {
//             onRemoveFavorite(recipe._id);
//         } else {
//             onAddFavorite(recipe._id);
//         }
//     };

//     return (
//         <NextLink href={`/recipes/${slug?.current}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
//             <Card sx={styles.card}>
//                 <Box sx={styles.imageWrapper}>
//                     <RecipeCardImage imageUrl={imageUrl} title={title} />
//                     <RecipeCardFavoriteButton disabled={loading} isFavorite={isFavorite} onClick={handleFavorite} />
//                 </Box>

//                 <CardContent sx={styles.content}>
//                     <RecipeCardTitle title={title} />
//                     <Separator />
//                     <RecipeCardDescription description={description} />
//                 </CardContent>
//             </Card>
//         </NextLink>
//     );
// });

// export default RecipeCard;

"use client";

import React, { useCallback } from "react";
import { Card, CardContent, Box } from "@mui/material";
import NextLink from "next/link";

import { styles } from "./styles";
import Separator from "../Common/Separator/Separator";

import type { Recipe } from "@/types";

import { RecipeCardDescription } from "./RecipeCard.Description";
import { RecipeCardTitle } from "./RecipeCard.Title";
import { RecipeCardImage } from "./RecipeCard.Image";
import { RecipeCardFavoriteButton } from "./RecipeCard.FavoriteButton";

import { useIsFavorite } from "@/stores/useFavoritesStore";
import { useFavorites } from "@/hooks";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmRemoveDialog from "../ConfirmRemoveDialog";

interface RecipeCardProps {
    recipe: Recipe;
    onRemoved?: (recipeId: string) => void;
}

export const RecipeCard = React.memo(function RecipeCard({ recipe, onRemoved }: RecipeCardProps) {
    const { title, description, slug } = recipe;

    const isFavorite = useIsFavorite(recipe._id);

    const { addFavorite, removeFavorite, isLoading } = useFavorites();

    const handleRemoveFavorite = useCallback(
        async (recipe: Recipe) => {
            await removeFavorite(recipe._id);
            onRemoved?.(recipe._id);
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

    const imageUrl = description?.image?.asset?.url || "/placeholder-image.jpg";

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLoading(recipe._id)) return;

        if (isFavorite) {
            openDialog(recipe);
        } else {
            addFavorite(recipe._id);
        }
    };

    return (
        <>
            <NextLink
                href={`/recipes/${slug?.current}`}
                passHref
                style={{
                    textDecoration: "none",
                    color: "inherit",
                }}
            >
                <Card sx={styles.card}>
                    <Box sx={styles.imageWrapper}>
                        <RecipeCardImage imageUrl={imageUrl} title={title} />

                        <RecipeCardFavoriteButton isFavorite={isFavorite} onClick={handleFavorite} />
                    </Box>

                    <CardContent sx={styles.content}>
                        <RecipeCardTitle title={title} />

                        <Separator />

                        <RecipeCardDescription description={description} />
                    </CardContent>
                </Card>
            </NextLink>

            {payload && <ConfirmRemoveDialog open={isOpen} loading={dialogLoading} title={payload.title} onCancel={cancel} onConfirm={confirm} />}
        </>
    );
});

export default RecipeCard;
