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
        mb: 5,
        mt: 5,
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
        fontSize: "1.25rem",
        fontFamily: "Playfair Display, Georgia, serif",
        fontWeight: 500,
        mb: 2,
    },
    ingredientsList: {
        ml: 0,
        pl: 0,
    },
    ingredientsListItem: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 0,
        py: 0.5,
        listStyle: "none",
    },
    ingredientsListItemFull: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: 0,
        listStyle: "none",
        py: 0.5,
    },
    preparationContainer: {
        mb: 4,
    },
    preparationTitle: {
        fontSize: "1.25rem",
        fontFamily: "Playfair Display, Georgia, serif",
        fontWeight: 500,
        mb: 2,
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
        textAlign: "center",
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
    // New styles for side-by-side layout
    ingredientsPrepWrapper: {
        display: { xs: "block", md: "flex" },
        alignItems: "stretch",
        mb: 4,
        mt: 6, // Adjusted to 1.5x (from base ~4 to 6)
    },
    ingredientsWrapper: {
        width: { md: "25%" },
        pr: { md: 2 },
        borderRight: { md: 1 },
        borderColor: "divider",
    },
    prepWrapper: {
        flex: 1,
        pl: { md: 2 },
    },
    // New styles for copy button
    copyButtonContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mb: 2,
    },
    copyButton: {
        fontSize: { xs: "0.875rem", sm: "1rem" }, // Responsive font sizing for readability
        padding: { xs: "8px 16px", sm: "12px 24px" }, // Responsive padding for touch targets (min ~44px height)
        minHeight: "44px", // WCAG touch target minimum
        color: theme => theme.palette.surface.main, // Menu background color for text
        borderColor: theme => theme.palette.surface.main, // Menu background color for border
        transition: "all 0.2s ease-in-out", // Smooth hover transition
        "&:hover": {
            borderColor: theme => theme.palette.surface.light,
            color: theme => theme.palette.surface.light,
            backgroundColor: "transparent", // No grey hover background
            borderRadius: "50%", // Round hover background
        },
        "&:focus-visible": {
            // WCAG focus ring (2px primary color outline)
            outline: "2px solid",
            outlineColor: theme => theme.palette.primary.main,
            outlineOffset: 2,
            borderRadius: theme => `${theme.shape.borderRadius}px`,
        },
    },
    

    ingredientsQuantity: {
        fontSize: FONT_SIZE,
        textAlign: "right",
        whiteSpace: "nowrap", 
    },
    ingredientsNotes: {
        mt: 2,
        fontSize: "0.9rem",
        color: "text.primary",
        fontStyle: "italic",
    },

    

    ingredientsName: {
        fontSize: FONT_SIZE,
        flex: 1,
        textAlign: "left",
        paddingRight: "16px",
    },
};

export const portableTextSx: { [key: string]: SxProps<Theme> } = {
    block: {
        mb: 0.125, // Reduced from 0.25 to half for tighter inter-line spacing
        fontSize: FONT_SIZE,
        lineHeight: 1.3, // Added reduced line-height for more compact text lines (default ~1.5)
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
