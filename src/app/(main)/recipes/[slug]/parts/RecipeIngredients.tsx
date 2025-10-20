// app/recipes/[slug]/parts/RecipeIngredients.tsx
import { Box, Typography, List, ListItem } from "@mui/material";
import { Recipe } from "@/lib/types";
import { styles, FONT_SIZE } from "../styles";

interface RecipeIngredientsProps {
    recipe: Recipe;
}

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
    return (
        recipe.ingredients &&
        recipe.ingredients.length > 0 && (
            <Box sx={styles.ingredientsContainer}>
                <Typography variant="h2" sx={styles.ingredientsTitle}>
                    Składniki
                </Typography>
                <List sx={styles.ingredientsList}>
                    {recipe.ingredients.map((ing, i) => (
                        <ListItem key={i} sx={styles.ingredientsListItem}>
                            <Typography variant="body2" sx={{ fontSize: FONT_SIZE }}>
                                {ing.quantity} {ing.name}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        )
    );
}
