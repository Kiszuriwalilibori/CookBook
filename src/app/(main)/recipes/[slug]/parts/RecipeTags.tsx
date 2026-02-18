
"use client";

import Link from "next/link";
import { Box, Chip } from "@mui/material";
import type { Recipe } from "@/types";

interface RecipeTagsProps {
    recipe: Recipe;
}

export default function RecipeTags({ recipe }: RecipeTagsProps) {
    if (!recipe.tags || recipe.tags.length === 0) return null;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {recipe.tags.map(tag => (
                <Chip key={tag} icon={<span style={{ fontSize: 16 }}>🏷️</span>} label={tag} component={Link} href={`/recipes?tags=${encodeURIComponent(tag.toLowerCase())}`} clickable color="secondary" variant="filled" />
            ))}
        </Box>
    );
}
