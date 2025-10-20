// app/recipes/[slug]/parts/RecipeSource.tsx
import { Box, Typography } from "@mui/material";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";

interface RecipeSourceProps {
    recipe: Recipe;
}

export function RecipeSource({ recipe }: RecipeSourceProps) {
    if (!recipe.source) {
        return null;
    }

    return (
        <Box id="RecipeSource" sx={styles.sourceContainer}>
            <Typography variant="body2" sx={styles.sourceText}>
                Źródło: {recipe.source.title || (recipe.source.isInternet ? recipe.source.http : recipe.source.book)}
            </Typography>
        </Box>
    );
}
