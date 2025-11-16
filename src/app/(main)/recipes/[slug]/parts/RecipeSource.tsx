// "use client";
// import { useAdminStore } from "@/stores/useAdminStore";
// import { Box, Typography } from "@mui/material";
// import { Recipe } from "@/lib/types";
// import { styles } from "../styles";
// interface RecipeSourceProps {
//     recipe: Recipe;
// }

// export function RecipeSource({ recipe }: RecipeSourceProps) {
//     const isAdminLogged = useAdminStore(state => state.isAdminLogged);
//     console.log("isAdminLogged", isAdminLogged);

//     if (!isAdminLogged || !recipe.source) {
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

"use client";
import { useAdminStore } from "@/stores/useAdminStore";
import { Box, Typography } from "@mui/material";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";

interface RecipeSourceProps {
    recipe: Recipe;
}

export function RecipeSource({ recipe }: RecipeSourceProps) {
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);

    if (!isAdminLogged || !recipe.source) {
        return null;
    }

    const { http, title, book, author, where } = recipe.source;

    // Sprawdź, czy http ma sensowną wartość (niepusta, nie null/undefined)
    const hasValidHttp = http && http.trim() !== "";

    let sourceText = "";

    if (hasValidHttp) {
        // Wyświetl tylko HTTP
        sourceText = `Źródło: ${http}`;
    } else {
        // Wyświetl pozostałe: title, author, book, where (jeśli dostępne)
        const parts: string[] = [];
        if (title && title.trim() !== "") parts.push(title);
        if (author && author.trim() !== "") parts.push(`autor: ${author}`);
        if (book && book.trim() !== "") parts.push(`książka: ${book}`);
        if (where && where.trim() !== "") parts.push(`gdzie: ${where}`);

        if (parts.length > 0) {
            sourceText = `Źródło: ${parts.join(" | ")}`;
        } else {
            return null;
        }
    }

    return (
        <Box id="RecipeSource" sx={styles.sourceContainer}>
            <Typography variant="body2" sx={styles.sourceText}>
                {sourceText}
            </Typography>
        </Box>
    );
}

// sprawdzone
