// app/recipes/[slug]/parts/RecipeIngredients.tsx
import { Box, Typography, List } from "@mui/material";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";

interface RecipeIngredientsProps {
    recipe: Recipe;
}

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
    return (
        recipe.ingredients &&
        recipe.ingredients.length > 0 && (
            <Box id="RecipeIngredients" sx={styles.ingredientsContainer}>
                <Typography variant="h2" sx={styles.ingredientsTitle}>
                    Składniki
                </Typography>
                <List sx={styles.ingredientsList}>
                    {recipe.ingredients.map((ing, i) => (
                        <Box
                            key={i}
                            component="li"
                            role="listitem"
                            sx={{
                                ...styles.ingredientsListItem,
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                padding: 0,
                                listStyle: "none",
                            }}
                        >
                            <Typography sx={styles.ingredientsQuantity}>
                                {ing.quantity || "\u00A0"} {/* Rezerwuje miejsce w kolumnie */}
                            </Typography>
                            <Typography sx={styles.ingredientsName}>{ing.name}</Typography>
                        </Box>
                    ))}
                </List>
            </Box>
        )
    );
}
