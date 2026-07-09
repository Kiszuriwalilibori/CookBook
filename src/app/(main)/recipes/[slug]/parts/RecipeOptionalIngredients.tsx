import { Box, Typography, List } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../styles";
import getIngredientKey from "@/utils/getIngredientKey";
import { RecipeIngredientItem } from "./RecipeIngredientsItem";

interface RecipeOptionalIngredientsProps {
    recipe: Recipe;
}

export function RecipeOptionalIngredients({ recipe }: RecipeOptionalIngredientsProps) {
    const ingredients = recipe.optionalIngredients;

    if (!ingredients || ingredients.length === 0) return null;

    return (
        <Box id="RecipeOptionalIngredients" sx={styles.ingredientsContainer}>
            <Typography variant="h2" sx={styles.ingredientsTitle}>
                Składniki opcjonalne
            </Typography>

            <List sx={styles.ingredientsList}>
                {ingredients.map(ingredient => (
                    <RecipeIngredientItem key={getIngredientKey(recipe._id, ingredient)} recipeId={recipe._id} ingredient={ingredient} />
                ))}
            </List>
        </Box>
    );
}
