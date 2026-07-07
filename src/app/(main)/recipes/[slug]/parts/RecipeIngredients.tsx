import { Box, Typography, List /*, Checkbox*/ } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../styles";
// import { useIngredientsChecks } from "@/hooks";
import getIngredientKey from "@/utils/getIngredientKey";
import { RecipeIngredientItem } from "./RecipeIngredientsItem";

interface RecipeIngredientsProps {
    recipe: Recipe;
}

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
    const ingredients = recipe.ingredients;

    if (!ingredients || ingredients.length === 0) return null;

    return (
        <Box id="RecipeIngredients" sx={styles.ingredientsContainer}>
            <Typography variant="h2" sx={styles.ingredientsTitle}>
                Składniki
            </Typography>

            <List sx={styles.ingredientsList}>
                {ingredients.map(ingredient => (
                    <RecipeIngredientItem key={getIngredientKey(recipe._id, ingredient)} recipeId={recipe._id} ingredient={ingredient} />
                ))}
            </List>

            {recipe.ingredientsNotes && <Typography sx={styles.ingredientsNotes}>{recipe.ingredientsNotes}</Typography>}
        </Box>
    );
}
