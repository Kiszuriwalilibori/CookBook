import { SxProps, Theme } from "@mui/material";

export const FONT_SIZE = { xs: "16px", sm: "17px", md: "18px" };

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
        fontFamily: "Playfair Display, Georgia, serif",
        fontWeight: 500,
        mb: 5,
    },
    descriptionContainer: {
        mb: 4,
    },
    descriptionTitle: {
        fontSize: "1.25rem",
        fontStyle: "italic",
        fontFamily: "Playfair Display, Georgia, serif",
        fontWeight: 500,
        mt: 5,
        mb: 5,
    },
    descriptionNotes: {
        color: "text.secondary",
        mb: 2,
        fontStyle: "italic",
    },

    metadata: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 2,
        mb: 5,
        mt: 5,
        fontSize: "0.875rem",
    },
    ingredientsContainer: {
        mb: 4,
    },

    ingredientsTitle: {
        fontSize: "1.25rem", // Matched to descriptionTitle
        fontFamily: "Playfair Display, Georgia, serif",
        fontWeight: 500, // Matched to descriptionTitle
        mb: 2,
    },
    preparationTitle: {
        fontSize: "1.25rem", // Matched to descriptionTitle
        fontFamily: "Playfair Display, Georgia, serif",
        fontWeight: 500, // Matched to descriptionTitle
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

    stepContainer: {
        mb: 4,
    },
    stepTitle: {
        fontSize: { xs: "1rem", md: "1.125rem" },
        fontFamily: "Playfair Display, Georgia, serif",
        fontWeight: "700",
        mb: 1,
    },
    stepImageContainer: {
        position: "relative",
        height: 192,
        mb: 0.25,
        borderRadius: 1,
        overflow: "hidden",
    },
    stepNotes: {
        color: "text.secondary",
        mt: 0.25,
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
    accordion: {
        boxShadow: 0,
        border: "none",
        "&:before": { display: "none" },
        "& .MuiAccordionSummary-root": { px: 0, minHeight: "auto" },
    },
    accordionSummary: {
        justifyContent: "flex-start",
        alignItems: "center",
        px: 0,
        minHeight: "auto",
        "& .MuiAccordionSummary-content": { ml: 0 },
    },
    accordionDetails: {
        p: 0,
    },
};

export const portableTextSx: { [key: string]: SxProps<Theme> } = {
    block: {
        mb: 0.125,
        fontSize: FONT_SIZE,
        lineHeight: 1.3,
    },
    list: {
        ml: 3,
        mb: 0.5,
        listStyleType: "disc",
    },
    listItem: {
        px: 0,
        py: 0.125,
    },
    strong: {
        fontWeight: "bold",
    },
    em: {
        fontStyle: "italic",
    },
    link: {
        color: "primary.main",
        textDecoration: "underline",
        "&:hover": { textDecoration: "none" },
    },
};
