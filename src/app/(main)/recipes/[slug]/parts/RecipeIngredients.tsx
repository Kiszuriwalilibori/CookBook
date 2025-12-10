import { Box, Typography, List } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../styles";

interface RecipeIngredientsProps {
    recipe: Recipe;
}

// --- extracted helper --- //
function formatIngredient(ing: NonNullable<Recipe["ingredients"]>[number]): string {
    const rawUnit = ing.unit?.toLowerCase() || "";

    // Specjalne przypadki:
    if (rawUnit === "szczypta") return "szczypta";
    if (rawUnit === "odrobina") return "odrobina";

    // Jeśli nie ma quantity → nic nie wyświetlaj
    if (!ing.quantity) return "";

    // Jednostki typu "sztuka", "sztuki" itp. → pokazujemy tylko liczbę
    const omitUnit = rawUnit.includes("sztuk");
    const unit = omitUnit ? "" : ing.unit || "";

    return `${ing.quantity}${unit ? ` ${unit}` : ""}`;
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
                {ingredients.map((ing, i) => (
                    <Box key={i} component="li" role="listitem" sx={styles.ingredientsListItemFull}>
                        <Typography sx={styles.ingredientsName}>{ing.name}</Typography>

                        <Typography sx={styles.ingredientsQuantity}>{formatIngredient(ing)}</Typography>
                    </Box>
                ))}
            </List>

            {recipe.ingredientsNotes && <Typography sx={styles.ingredientsNotes}>{recipe.ingredientsNotes}</Typography>}
        </Box>
    );
}
