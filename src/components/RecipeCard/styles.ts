// components/styles.ts
import theme from "@/themes/theme";
import { SxProps, Theme } from "@mui/material";

export const cardTextColor = "grey.800";

export const styles: { [key: string]: SxProps<Theme> } = {
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

    description: {
        fontFamily: "Playfair Display, serif",
        fontWeight: 400,
        fontSize: "16px",
        fontStyle: "italic",
        color: cardTextColor,
        display: "-webkit-box", // line-clamp
        WebkitLineClamp: 3, // ograniczenie do 3 linii
        WebkitBoxOrient: "vertical", // potrzebne do -webkit-line-clamp
        overflow: "hidden", // ukrywa resztę
        textOverflow: "ellipsis", // dodaje "…"
    },

    details: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 0.5,
    },
};
export const favoriteIcon = (isFavorite: boolean): SxProps => ({
    position: "absolute",
    top: 8,
    right: 8,
    color: isFavorite ? "red" : theme.palette.grey[600],
});
