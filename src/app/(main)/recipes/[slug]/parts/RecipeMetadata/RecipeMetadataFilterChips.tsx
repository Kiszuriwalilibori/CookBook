"use client";

import Link from "next/link";
import { Chip, Box, alpha } from "@mui/material";

interface RecipeMetadataFilterChipsProps {
    values: string[];
    filterKey: "tags" | "cuisine" | "dietary";
}

export function RecipeMetadataFilterChips({ values, filterKey }: RecipeMetadataFilterChipsProps) {
    if (!values || values.length === 0) return null;

    return (
        <Box
            component="span"
            sx={{
                display: "inline-flex",
                gap: 0.5,
                flexWrap: "wrap",
                ml: 0.5,
            }}
        >
            {values.map(value => (
                <Chip
                    key={value}
                    size="small"
                    label={value}
                    component={Link}
                    href={`/recipes?${filterKey}=${encodeURIComponent(value.toLowerCase())}`}
                    clickable
                    color="secondary"
                    variant="filled"
                    sx={{
                        "&:hover": {
                            backgroundColor: theme => alpha(theme.palette.secondary.main, 0.6),
                        },
                        textTransform: "none",
                    }}
                />
            ))}
        </Box>
    );
}
