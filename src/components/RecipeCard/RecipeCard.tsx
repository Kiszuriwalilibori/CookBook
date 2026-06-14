"use client";

import React from "react";
import { Card, CardContent, Box } from "@mui/material";
import NextLink from "next/link";
import { styles } from "./styles";
import Separator from "../Common/Separator/Separator";
import type { Recipe } from "@/types";
import { RecipeCardDescription } from "./RecipeCard.Description";
import { RecipeCardTitle } from "./RecipeCard.Title";
import { RecipeCardImage } from "./RecipeCard.Image";
import { RecipeCardFavoriteButton } from "./RecipeCard.FavoriteButton";

interface RecipeCardProps {
    recipe: Recipe;
    isFavorite: boolean;
    onAddFavorite?: (id: string) => void;
    onRemoveFavorite?: (id: string) => void;
}

export const RecipeCard = React.memo(function RecipeCard({ recipe, isFavorite, onAddFavorite, onRemoveFavorite }: RecipeCardProps) {
    const { title, description, slug } = recipe;
    const imageUrl = description?.image?.asset?.url || "/placeholder-image.jpg";
    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!onAddFavorite || !onRemoveFavorite) return;
        if (isFavorite) {
            onRemoveFavorite(recipe._id);
        } else {
            onAddFavorite(recipe._id);
        }
    };

    return (
        <NextLink href={`/recipes/${slug?.current}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
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
    );
});

export default RecipeCard;
