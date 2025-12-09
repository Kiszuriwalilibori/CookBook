// app/recipes/[slug]/parts/RecipeIngredients.tsx
import { Box, Typography, List } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../styles";

interface RecipeIngredientsProps {
    recipe: Recipe;
}

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
    console.log(recipe.ingredients);
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
                                justifyContent: "space-between", // ← NAJWAŻNIEJSZE
                                width: "100%",
                                listStyle: "none",
                                padding: 0,
                            }}
                        >
                            {/* NAME (lewa strona) */}
                            <Typography sx={styles.ingredientsName}>{ing.name}</Typography>

                            {/* QUANTITY + UNIT (prawa strona) */}
                            <Typography sx={styles.ingredientsQuantity}> {ing.quantity ? `${ing.quantity} ${ing.unit || ""}` : ""}</Typography>
                        </Box>
                    ))}
                </List>
            </Box>
        )
    );
}
