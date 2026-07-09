import { Typography } from "@mui/material";

import { Recipe } from "@/types";
import { styles } from "../styles";

interface RecipeIngredientsNotesProps {
    recipe: Recipe;
}

export function RecipeIngredientsNotes({ recipe }: RecipeIngredientsNotesProps) {
    if (!recipe.ingredientsNotes) return null;

    return <Typography sx={styles.ingredientsNotes}>{recipe.ingredientsNotes}</Typography>;
}
