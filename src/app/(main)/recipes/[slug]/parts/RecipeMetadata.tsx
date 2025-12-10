// app/recipes/[slug]/parts/RecipeMetadata.tsx
import { Typography, Box } from "@mui/material";
import  {fieldTranslations,Recipe} from "@/types";
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
                ⏱️ {getLabel("prepTime")}: {recipe.prepTime} min
            </Typography>
            {recipe.cookTime && (
                <Typography component="div">
                    ⏲️ {getLabel("cookTime")}: {recipe.cookTime} min
                </Typography>
            )}
            {recipe.recipeYield && (
                <Typography component="div">
                    🍽️ {recipe.recipeYield} {recipe.recipeYield === 1 ? "porcja" : recipe.recipeYield >= 2 && recipe.recipeYield <= 4 ? "porcje" : "porcji"}
                </Typography>
            )}

            {recipe.cuisine && <Typography component="div">🌍 {recipe.cuisine}</Typography>}
            {recipe.calories && (
                <Typography component="div">
                    🔥 {getLabel("calories")}: {recipe.calories}
                </Typography>
            )}
            {recipe.dietary && recipe.dietary.length > 0 && (
                <Typography component="div">
                    🚫 {getLabel("dietary")}: {recipe.dietary.join(", ")}
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
