// app/recipes/[slug]/styles.ts
import { SxProps, Theme } from "@mui/material";

export const styles: { [key: string]: SxProps<Theme> } = {
    root: {
        maxWidth: 1024,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: 3,
    },
    heroImageContainer: {
        position: "relative",
        height: 384,
        mb: 3,
        borderRadius: 1,
        overflow: "hidden",
    },
    mainTitle: {
        fontSize: { xs: "2rem", md: "3rem" },
        fontWeight: "bold",
        mb: 2,
    },
    descriptionContainer: {
        mb: 4,
    },
    descriptionTitle: {
        fontSize: "1.25rem",
        fontStyle: "italic",
        mb: 2,
    },
    descriptionNotes: {
        color: "text.secondary",
        mb: 2,
        fontStyle: "italic",
    },
    metadata: {
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 4,
        fontSize: "0.875rem",
        color: "text.secondary",
    },
    ingredientsContainer: {
        mb: 4,
    },
    ingredientsTitle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        mb: 2,
    },
    ingredientsList: {
        ml: 3,
    },
    ingredientsListItem: {
        px: 0,
        py: 0.5,
    },
    preparationContainer: {
        mb: 4,
    },
    preparationTitle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        mb: 2,
    },
    stepContainer: {
        mb: 4,
    },
    stepTitle: {
        fontSize: "1.125rem",
        fontWeight: "600",
        mb: 1,
    },
    stepImageContainer: {
        position: "relative",
        height: 192,
        mb: 1,
        borderRadius: 1,
        overflow: "hidden",
    },
    stepNotes: {
        color: "text.secondary",
        mt: 1,
        fontStyle: "italic",
    },
    additionalInfoGrid: {
        fontSize: "0.875rem",
    },
    additionalInfoItem: {
        size: { xs: 12, sm: 6 },
    },
    sourceContainer: {
        mt: 4,
        pt: 2,
        borderTop: 1,
        borderColor: "divider",
    },
    sourceText: {
        color: "text.secondary",
    },
};
