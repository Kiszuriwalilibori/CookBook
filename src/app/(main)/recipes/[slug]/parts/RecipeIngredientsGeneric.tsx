import { Box, Typography, List } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../styles";
import getIngredientKey from "@/utils/getIngredientKey";
import { RecipeIngredientItem } from "./RecipeIngredientsItem";

interface RecipeIngredientsProps {
    recipe: Recipe;
    title: string;
    id: string;
    ingredients: Recipe["ingredients"];
}

export function RecipeIngredientsGeneric({ recipe, title, id, ingredients }: RecipeIngredientsProps) {
    if (!ingredients || ingredients.length === 0) return null;

    return (
        <Box id={id} sx={styles.ingredientsContainer}>
            <Typography variant="h2" sx={styles.ingredientsTitle}>
                {title}
            </Typography>

            <List sx={styles.ingredientsList}>
                {ingredients.map(ingredient => (
                    <RecipeIngredientItem key={getIngredientKey(recipe._id, ingredient)} recipeId={recipe._id} ingredient={ingredient} />
                ))}
            </List>
        </Box>
    );
}
