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
// components/RecipeCard.tsx (updated extraction to handle firstBlockText object)
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const { title, description, preparationTime, difficulty, slug } = recipe;
    const contentText = description?.firstBlockText?.children?.map(child => child.text).join(" ") || ""; // Join texts from children array
    const descTitle = description?.title || contentText || "No description available."; // Prioritize title, then joined content text
    const imageUrl = description?.image?.asset?.url || "/placeholder-image.jpg";
    const prepTime = `${preparationTime || 0} min`;
    console.log(recipe);
    return (
        <NextLink href={`/recipes/${slug?.current}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
            <Card sx={styles.card}>
                <CardMedia component="img" height="200" image={imageUrl} alt={title} sx={styles.media} />
                <CardContent sx={styles.content}>
                    <Typography variant="h6" gutterBottom sx={styles.title}>
                        {title}
                    </Typography>
                    <Box sx={styles.separator}>
                        <Box sx={styles.upperLine} />
                        <Box sx={styles.lowerLine} />
                    </Box>
                    <Typography variant="body2" sx={styles.description}>
                        {descTitle}
                    </Typography>
                    <Box sx={styles.details}>
                        <Chip label={prepTime} size="small" sx={styles.chip} />

                        {difficulty && <Chip label={difficulty} size="small" color="primary" sx={styles.chip} />}
                    </Box>
                </CardContent>
            </Card>
        </NextLink>
    );
};

export default RecipeCard;
