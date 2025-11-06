// components/styles.ts
import { SxProps, Theme } from "@mui/material";

export const styles: { [key: string]: SxProps<Theme> } = {
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 3,
        },
        // Responsywność: Pełna szerokość na mobile, mniejsza na desktop
        width: { xs: "100%", sm: "auto" },
        maxWidth: { xs: "none", sm: 330 },
    },
    media: {
        // Aspect ratio responsywny: Wyższy na mobile dla lepszego UX
        height: { xs: 180, sm: 200 },
        objectFit: "cover",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
            transform: "scale(1.05)", // Direct scale on media for "getting closer" effect
        },
        "& img": {
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ensures image fills without distortion
        },
    },
    content: {
        flexGrow: 1,
        p: { xs: 1.5, sm: 2 }, // Mniejsze padding na mobile
        pb: { xs: 1.5, sm: 2 },
    },
    title: {
        fontFamily: "Libre Baskerville, serif",
        fontWeight: "normal",
        color: "grey.800",
        height: { xs: 50, sm: 60 }, // Ogranicz wysokość dla responsywności
        overflow: "hidden",
        textOverflow: "ellipsis",
        textTransform: "uppercase",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        mb: 1,
    },
    description: {
        fontFamily: "Playfair Display, serif",
        fontWeight: 400,
        fontSize: "16px",
        fontStyle: "italic",
        height: { xs: 40, sm: 60 },
        color: "grey.800", // Skrócone na mobile
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        mb: 1,
    },
    details: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 0.5,
    },
    chip: {
        fontSize: { xs: "0.7rem", sm: "0.8rem" },
        backgroundColor: "surface.main",
        color: "text.primary", // Ensure text is visible on yellow bg
        "& .MuiChip-label": {
            padding: "2px 8px", // Minimal padding inside chip
        },

        // Mniejsze na mobile
    },
    separator: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Horizontally centered
        justifyContent: "center",
        mb: 1, // Space after separator to description
        mt: 2,
        width: "100%",
    },
    upperLine: {
        width: "30%", // Roughly 30% of card width (99px on 330px card)
        height: "1px",
        backgroundColor: "grey.800",

        // Subtle line color (adjust if needed)
        mb: 0, // No margin
    },
    lowerLine: {
        width: "15%", // Half of upper (49.5px on 330px card)
        height: "1px",
        backgroundColor: "#333",

        // Matching line color
        mt: "2px", // Roughly 2px distance between lines
    },
};
