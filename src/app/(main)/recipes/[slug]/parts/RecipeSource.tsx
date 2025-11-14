// // app/recipes/[slug]/parts/RecipeSource.tsx
// import { Box, Typography } from "@mui/material";
// import { Recipe } from "@/lib/types";
// import { styles } from "../styles";

// interface RecipeSourceProps {
//     recipe: Recipe;
// }

// export function RecipeSource({ recipe }: RecipeSourceProps) {
//     if (!recipe.source) {
//         return null;
//     }

//     return (
//         <Box id="RecipeSource" sx={styles.sourceContainer}>
//             <Typography variant="body2" sx={styles.sourceText}>
//                 Źródło: {recipe.source.title || (recipe.source.isInternet ? recipe.source.http : recipe.source.book)}
//             </Typography>
//         </Box>
//     );
// }

"use client"; // Kluczowe: czyni to client component
import { useAdminStore } from "@/stores/useAdminStore"; // Poprawiona ścieżka do store
import { Box, Typography } from "@mui/material";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";
interface RecipeSourceProps {
    recipe: Recipe;
}

export function RecipeSource({ recipe }: RecipeSourceProps) {
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);
    console.log("isAdminLogged", isAdminLogged);
    
    if (!isAdminLogged || !recipe.source) {
        return null;
    }
    return (
        <Box id="RecipeSource" sx={styles.sourceContainer}>
            <Typography variant="body2" sx={styles.sourceText}>
                Źródło: {recipe.source.title || (recipe.source.isInternet ? recipe.source.http : recipe.source.book)}
            </Typography>
        </Box>
    );
}
