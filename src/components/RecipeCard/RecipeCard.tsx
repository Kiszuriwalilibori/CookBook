// components/RecipeCard.tsx
import React from "react";
import { Card, CardMedia, CardContent, Typography, Chip, Box } from "@mui/material";
import NextLink from "next/link";
import { styles } from "./styles";
import type { Recipe } from "@/lib/types"; // Import full Recipe type for 1:1 mapping

// Props now accept the full Recipe object for 1:1 schema alignment
interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const { title, description, preparationTime, servings, difficulty, slug } = recipe;
    const descriptionText = description?.content?.[0]?.children?.[0]?.text || "No description available.";
    const imageUrl = description?.image?.asset?.url || "/placeholder-image.jpg"; // Fallback if no image
    const prepTime = `${preparationTime || 0} min`;

    return (
        <NextLink href={`/recipes/${slug?.current}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
            <Card sx={styles.card}>
                <CardMedia component="img" height="200" image={imageUrl} alt={title} sx={styles.media} />
                <CardContent sx={styles.content}>
                    <Typography variant="h6" gutterBottom sx={styles.title}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={styles.description}>
                        {descriptionText}
                    </Typography>
                    <Box sx={styles.details}>
                        <Chip label={prepTime} size="small" sx={styles.chip} />
                        <Chip label={`${servings || 1} servings`} size="small" sx={styles.chip} />
                        {difficulty && <Chip label={difficulty} size="small" color="primary" sx={styles.chip} />}
                    </Box>
                </CardContent>
            </Card>
        </NextLink>
    );
};

export default RecipeCard;
