import React from "react";
import { CardMedia, Box } from "@mui/material";
import { styles } from "./styles";

interface RecipeCardImageProps {
    imageUrl: string;
    title: string;
}

export const RecipeCardImage = React.memo(function RecipeCardImage({ imageUrl, title }: RecipeCardImageProps) {
    return (
        <Box sx={styles.imageWrapper}>
            <CardMedia component="img" height={200} image={imageUrl} alt={title} sx={styles.media} />
        </Box>
    );
});
