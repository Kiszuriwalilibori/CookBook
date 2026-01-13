
import React from "react";
import { Card, CardMedia, CardContent, Typography, Chip, Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NextLink from "next/link";

import { styles, favoriteIcon } from "./styles";
import Separator from "../Common/Separator/Separator";
import type { Recipe } from "@/types";
import { useIsUserLogged } from "@/stores/useAdminStore";

interface RecipeCardProps {
    recipe: Recipe;
    isFavorite: boolean;
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, addFavorite, removeFavorite }) => {
    const { title, description, prepTime: rawPrepTime, cookTime: rawCookTime, slug } = recipe;
    const isUserLogged = useIsUserLogged();

    const contentText = description?.firstBlockText?.children?.map(child => child.text).join(" ") || "";
    const descTitle = description?.title || contentText || "No description available.";
    const imageUrl = description?.image?.asset?.url || "/placeholder-image.jpg";

    const prepTime = `${rawPrepTime || 0} min`;
    const cookTime = `${rawCookTime || 0} min`;

    return (
        <NextLink href={`/recipes/${slug?.current}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
            <Card sx={styles.card}>
                <Box sx={{ position: "relative" }}>
                    <CardMedia component="img" height="200" image={imageUrl} alt={title} sx={styles.media} />

                    {isUserLogged && (
                        <IconButton
                            onClick={e => {
                                e.preventDefault();

                                if (isFavorite) {
                                    removeFavorite(recipe._id);
                                } else {
                                    addFavorite(recipe._id);
                                }
                            }}
                            sx={favoriteIcon(isFavorite)}
                        >
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
                    <Box sx={styles.details}>
                        <Chip label={prepTime} size="small" sx={styles.chip} />
                        <Chip label={cookTime} size="small" sx={styles.chip} />
                    </Box>
                </CardContent>
            </Card>
        </NextLink>
    );
};
export default RecipeCard;
