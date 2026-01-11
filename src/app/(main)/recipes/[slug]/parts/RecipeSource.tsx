"use client";

import { Box, Typography } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../styles";
import { useIsAdminLogged } from "@/stores/useAdminStore";

interface RecipeSourceProps {
    recipe: Recipe;
}

export function RecipeSource({ recipe }: RecipeSourceProps) {
    const isAdminLogged = useIsAdminLogged();

    if (!isAdminLogged || !recipe.source) {
        return null;
    }

    const { url, title, book, author, where } = recipe.source;

    // Sprawdź, czy http ma sensowną wartość (niepusta, nie null/undefined)
    const hasValidURL = url && url.trim() !== "";

    let sourceText = "";

    if (hasValidURL) {
        // Wyświetl tylko HTTP
        sourceText = `Źródło: ${url}`;
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
