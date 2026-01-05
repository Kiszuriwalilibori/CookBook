// app/recipes/[slug]/parts/RecipeMetadata.tsx
import { Typography, Box } from "@mui/material";
import { Recipe } from "@/types";

import { styles } from "../styles";
import { getTranslation } from "@/models/fieldTranslations";

interface RecipeMetadataProps {
    recipe: Recipe;
}

export function RecipeMetadata({ recipe }: RecipeMetadataProps) {
    return (
        <Box id="RecipeMetadata" sx={styles.metadata}>
            <Typography component="div">
                ⏱️ {getTranslation("prepTime")}: {recipe.prepTime} min
            </Typography>
            {recipe.cookTime && (
                <Typography component="div">
                    ⏲️ {getTranslation("cookTime")}: {recipe.cookTime} min
                </Typography>
            )}
            {recipe.recipeYield && (
                <Typography component="div">
                    🍽️ {recipe.recipeYield} {recipe.recipeYield === 1 ? "porcja" : recipe.recipeYield >= 2 && recipe.recipeYield <= 4 ? "porcje" : "porcji"}
                </Typography>
            )}

            {recipe.cuisine && recipe.cuisine.length > 0 && <Typography component="div">🌍 {recipe.cuisine.join(", ")}</Typography>}
            {recipe.calories && (
                <Typography component="div">
                    🔥 {getTranslation("calories")}: {recipe.calories}
                </Typography>
            )}
            {recipe.dietary && recipe.dietary.length > 0 && (
                <Typography component="div">
                    🚫 {getTranslation("dietary")}: {recipe.dietary.join(", ")}
                </Typography>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
                <Typography component="div">
                    🏷️ {getTranslation("tags")}: {recipe.tags.join(", ")}
                </Typography>
            )}
        </Box>
    );
}

// todo: wstawić jakieś funkcje uzależniające od typów czy cokolwiek, nie taki goły kod w stylu {getTranslation("tags")}: {recipe.tags.join(", ")}
