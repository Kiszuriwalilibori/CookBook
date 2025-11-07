// app/recipes/[slug]/parts/RecipeMetadata.tsx
import { Typography, Box } from "@mui/material";
import { Recipe } from "@/lib/types";
import { fieldTranslations } from "@/lib/types";
import { styles } from "../styles";

// Funkcja do pobierania tłumaczenia etykiety
const getLabel = (field: string): string => fieldTranslations[field] || field;

interface RecipeMetadataProps {
    recipe: Recipe;
}

export function RecipeMetadata({ recipe }: RecipeMetadataProps) {
    return (
        <Box id="RecipeMetadata" sx={styles.metadata}>
            <Typography component="div">
                ⏱️ {getLabel("preparationTime")}: {recipe.preparationTime} min
            </Typography>
            {recipe.cookingTime && (
                <Typography component="div">
                    ⏲️ {getLabel("cookingTime")}: {recipe.cookingTime} min
                </Typography>
            )}
            {recipe.servings && (
                <Typography component="div">
                    🍽️ {recipe.servings} {recipe.servings === 1 ? "porcja" : recipe.servings >= 2 && recipe.servings <= 4 ? "porcje" : "porcji"}
                </Typography>
            )}

            {recipe.cuisine && <Typography component="div">🌍 {recipe.cuisine}</Typography>}
            {recipe.calories && (
                <Typography component="div">
                    🔥 {getLabel("calories")}: {recipe.calories}
                </Typography>
            )}
            {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                <Typography component="div">
                    🚫 {getLabel("dietaryRestrictions")}: {recipe.dietaryRestrictions.join(", ")}
                </Typography>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
                <Typography component="div">
                    🏷️ {getLabel("tags")}: {recipe.tags.join(", ")}
                </Typography>
            )}
        </Box>
    );
}
