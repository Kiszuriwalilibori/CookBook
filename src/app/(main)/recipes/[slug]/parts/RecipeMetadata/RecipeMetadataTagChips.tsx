"use client";

import Link from "next/link";
import { Chip, Box, alpha } from "@mui/material";

interface RecipeTagChipsProps {
    tags: string[];
}

export function RecipeMetadataTagChips({ tags }: RecipeTagChipsProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <Box component="span" sx={{ display: "inline-flex", gap: 0.5, flexWrap: "wrap", ml: 0.5 }}>
            {tags.map(tag => (
                <Chip
                    key={tag}
                    size="small"
                    label={tag}
                    component={Link}
                    href={`/recipes?tags=${encodeURIComponent(tag.toLowerCase())}`}
                    clickable
                    color="secondary"
                    variant="filled"
                    sx={{
                        "&:hover": {
                            backgroundColor: theme => alpha(theme.palette.secondary.main, 0.6), // lekki odcień przy hover
                        },
                        textTransform: "none",
                    }}
                />
            ))}
        </Box>
    );
}
