"use client";

import Link from "next/link";
import { Chip, Box } from "@mui/material";
import { chipStyles, containerStyles } from "./RecipeMetadataFilterChips.styles";
// import { styles } from "../../styles";

interface RecipeMetadataFilterChipsProps {
    values: string[];
    filterKey: "tags" | "cuisine" | "dietary";
}

export function RecipeMetadataFilterChips({ values, filterKey }: RecipeMetadataFilterChipsProps) {
    if (!values || values.length === 0) return null;

    return (
        <Box component="span" sx={containerStyles}>
            {values.map(value => (
                <Chip key={value} size="small" label={value} component={Link} href={`/recipes?${filterKey}=${encodeURIComponent(value.toLowerCase())}`} clickable color="secondary" variant="filled" sx={chipStyles} />
            ))}
        </Box>
    );
}
