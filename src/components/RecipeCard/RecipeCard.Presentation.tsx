import React from "react";
import { Box, Card, CardContent } from "@mui/material";
import NextLink from "next/link";

import Separator from "../Common/Separator/Separator";

import type { Recipe } from "@/types";

import { RecipeCardDescription } from "./RecipeCard.Description";
import { RecipeCardTitle } from "./RecipeCard.Title";
import { RecipeCardImage } from "./RecipeCard.Image";
import { RecipeCardFavoriteButton } from "./RecipeCard.FavoriteButton";
import { imageWrapperStyles } from "./RecipeCard.ImageWrapper.styles";
import { cardContentStyles } from "./RecipeCard.CardContent.styles";
import { cardStyles } from "./RecipeCard.Card.styles";
import { nextLinkStyles } from "./RecipeCard.NextLink.styles";

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
        <Card sx={cardStyles}>
            <NextLink
                href={`/recipes/${slug?.current}`}
                style={nextLinkStyles}
                // style={{
                //     display: "flex",
                //     flexDirection: "column",
                //     flexGrow: 1,
                //     textDecoration: "none",
                //     color: "inherit",
                // }}
            >
                <Box sx={imageWrapperStyles}>
                    <RecipeCardImage imageUrl={imageUrl} title={title} />
                </Box>

                <CardContent sx={cardContentStyles}>
                    <RecipeCardTitle title={title} />

                    <Separator />

                    <RecipeCardDescription description={description} />
                </CardContent>
            </NextLink>

            <RecipeCardFavoriteButton isFavorite={isFavorite} onClick={onFavorite} isLoading={isLoading} />
        </Card>
    );
});
