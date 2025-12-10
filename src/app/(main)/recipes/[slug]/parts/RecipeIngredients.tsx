
// // app/recipes/[slug]/parts/RecipeIngredients.tsx
// import { Box, Typography, List } from "@mui/material";
// import { Recipe } from "@/types";
// import { styles } from "../styles";

// interface RecipeIngredientsProps {
//     recipe: Recipe;
// }

// // --- extracted helper --- //
// function formatIngredient(ing: NonNullable<Recipe["ingredients"]>[number]): string {
//     if (!ing.quantity) return "";

//     const rawUnit = ing.unit?.toLowerCase() || "";
//     const omit = rawUnit.includes("sztuk"); // ukrywa gdy unit zawiera "sztuk"

//     const unit = omit ? "" : ing.unit || "";

//     return `${ing.quantity}${unit ? ` ${unit}` : ""}`;
// }

// export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
//     const ingredients = recipe.ingredients;
//     console.log(ingredients);
//     if (!ingredients || ingredients.length === 0) return null;

//     return (
//         <Box id="RecipeIngredients" sx={styles.ingredientsContainer}>
//             <Typography variant="h2" sx={styles.ingredientsTitle}>
//                 Składniki
//             </Typography>

//             <List sx={styles.ingredientsList}>
//                 {ingredients.map((ing, i) => (
//                     <Box
//                         key={i}
//                         component="li"
//                         role="listitem"
//                         sx={{
//                             ...styles.ingredientsListItem,
//                             display: "flex",
//                             justifyContent: "space-between",
//                             width: "100%",
//                             padding: 0,
//                             listStyle: "none",
//                         }}
//                     >
//                         {/* NAME (left side) */}
//                         <Typography sx={styles.ingredientsName}>{ing.name}</Typography>

//                         {/* QUANTITY + UNIT (right side) */}
//                         <Typography sx={styles.ingredientsQuantity}>{formatIngredient(ing)}</Typography>
//                     </Box>
//                 ))}
//             </List>

//             {/* --- Optional ingredients notes --- */}
//             {recipe.ingredientsNotes && (
//                 <Typography
//                     sx={{
//                         mt: 2,
//                         fontSize: "0.9rem",
//                         color: "text.secondary",
//                         fontStyle: "italic",
//                     }}
//                 >
//                     {recipe.ingredientsNotes}
//                 </Typography>
//             )}
//         </Box>
//     );
// }
import { Box, Typography, List } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../styles";

interface RecipeIngredientsProps {
    recipe: Recipe;
}

// --- extracted helper --- //
function formatIngredient(ing: NonNullable<Recipe["ingredients"]>[number]): string {
    if (!ing.quantity) return "";

    const rawUnit = ing.unit?.toLowerCase() || "";
    const omit = rawUnit.includes("sztuk"); // ukrywa gdy unit zawiera "sztuk"

    const unit = omit ? "" : ing.unit || "";

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
