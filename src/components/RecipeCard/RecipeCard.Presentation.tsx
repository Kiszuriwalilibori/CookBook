import React from "react";
import { Box, Card, CardContent } from "@mui/material";
import NextLink from "next/link";

import { styles } from "./styles";
import Separator from "../Common/Separator/Separator";

import type { Recipe } from "@/types";

import { RecipeCardDescription } from "./RecipeCard.Description";
import { RecipeCardTitle } from "./RecipeCard.Title";
import { RecipeCardImage } from "./RecipeCard.Image";
import { RecipeCardFavoriteButton } from "./RecipeCard.FavoriteButton";

interface RecipeCardPresentationProps {
    recipe: Recipe;
    isFavorite: boolean;
    imageUrl: string;
    onFavorite: () => void;
    isLoading: boolean;
}

export const RecipeCardPresentation = React.memo(function RecipeCardPresentation({ recipe, isFavorite, imageUrl, onFavorite, isLoading }: RecipeCardPresentationProps) {
    const { title, description, slug } = recipe;

    return (
        <Card sx={styles.card}>
            <NextLink
                href={`/recipes/${slug?.current}`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    textDecoration: "none",
                    color: "inherit",
                }}
            >
                <Box sx={styles.imageWrapper}>
                    <RecipeCardImage imageUrl={imageUrl} title={title} />
                </Box>

                <CardContent sx={styles.content}>
                    <RecipeCardTitle title={title} />

                    <Separator />

                    <RecipeCardDescription description={description} />
                </CardContent>
            </NextLink>

            <RecipeCardFavoriteButton isFavorite={isFavorite} onClick={onFavorite} isLoading={isLoading} />
        </Card>
    );
});
