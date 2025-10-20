// app/recipes/[slug]/parts/RecipeDescription.tsx
import { Box, Typography } from "@mui/material";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { Recipe } from "@/lib/types";
import { Separator } from "@/components";
import { styles, portableTextSx } from "../styles";

// Custom PortableText components (typed correctly for compatibility)
const PortableTextComponents: Partial<PortableTextComponents> = {
    block: ({ children }) => (
        <Typography variant="body1" sx={portableTextSx.block}>
            {children}
        </Typography>
    ),
    list: ({ children }) => (
        <Box component="ul" sx={portableTextSx.list}>
            {children}
        </Box>
    ),
    listItem: ({ children }) => (
        <Box component="li" sx={portableTextSx.listItem}>
            {children}
        </Box>
    ),
    marks: {
        strong: ({ children }) => (
            <Typography component="strong" sx={portableTextSx.strong}>
                {children}
            </Typography>
        ),
        em: ({ children }) => (
            <Typography component="em" sx={portableTextSx.em}>
                {children}
            </Typography>
        ),
        link: ({ children, value }) => (
            <Typography component="a" href={value?.href || "#"} target="_blank" rel="noopener noreferrer" sx={portableTextSx.link}>
                {children}
            </Typography>
        ),
    },
};

interface RecipeDescriptionProps {
    recipe: Recipe;
}

export function RecipeDescription({ recipe }: RecipeDescriptionProps) {
    return (
        <Box sx={styles.descriptionContainer}>
            <Separator />
            {recipe.description && (
                <>
                    {recipe.description.title && (
                        <Typography variant="h2" sx={styles.descriptionTitle}>
                            {recipe.description.title}
                        </Typography>
                    )}
                    {recipe.description.notes && (
                        <Typography variant="body2" sx={styles.descriptionNotes}>
                            {recipe.description.notes}
                        </Typography>
                    )}
                    {recipe.description.content && <PortableText value={recipe.description.content} components={PortableTextComponents} />}
                </>
            )}
        </Box>
    );
}
