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
        maxWidth: { xs: "none", sm: 300 },
    },
    media: {
        // Aspect ratio responsywny: Wyższy na mobile dla lepszego UX
        height: { xs: 180, sm: 200 },
        objectFit: "cover",
    },
    content: {
        flexGrow: 1,
        p: { xs: 1.5, sm: 2 }, // Mniejsze padding na mobile
        pb: { xs: 1.5, sm: 2 },
    },
    title: {
        fontWeight: "bold",
        height: { xs: 50, sm: 60 }, // Ogranicz wysokość dla responsywności
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
    },
    description: {
        height: { xs: 40, sm: 60 }, // Skrócone na mobile
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
        // Mniejsze na mobile
    },
};
