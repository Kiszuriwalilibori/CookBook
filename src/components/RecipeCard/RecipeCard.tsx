import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import NextLink from "next/link";
import { styles, favoriteIcon } from "./styles";

import type { Recipe } from "@/types";
import { useIsUserLogged } from "@/stores/useAdminStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import Separator from "../Common/Separator/Separator";

interface RecipeCardProps {
    recipe: Recipe;
    isFavorite: boolean;
    addFavorite: () => void;
    removeFavorite: () => void;
    loading: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, addFavorite, removeFavorite, loading }) => {
    const { title, description, slug } = recipe;
    const isUserLogged = useIsUserLogged();
    const { hydrated } = useFavoritesStore();
    const contentText = description?.firstBlockText?.children?.map(child => child.text).join(" ") || "";
    const descTitle = description?.title || contentText || "No description available.";
    const imageUrl = description?.image?.asset?.url || "/placeholder-image.jpg";

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (loading) return;
        if (isFavorite) removeFavorite();
        else addFavorite();
    };

    return (
        <NextLink href={`/recipes/${slug?.current}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
            <Card sx={styles.card}>
                <Box sx={{ position: "relative" }}>
                    <CardMedia component="img" height="200" image={imageUrl} alt={title} sx={styles.media} />
                    {isUserLogged && hydrated && (
                        <IconButton disabled={loading} onClick={handleFavorite} sx={favoriteIcon(isFavorite)}>
                            <FavoriteIcon />
                        </IconButton>
                    )}
                </Box>
                <CardContent sx={styles.content}>
                    <Typography variant="h6" gutterBottom sx={styles.title}>
                        {title}
                    </Typography>
                    <Separator />
                    <Typography variant="body2" sx={styles.description}>
                        {descTitle}
                    </Typography>
                </CardContent>
            </Card>
        </NextLink>
    );
};

export default RecipeCard;
