import type { SxProps, Theme } from "@mui/material";

export const cardStyles: SxProps<Theme> = {
    position: "relative",
    height: "100%",
    width: "100%",
    maxWidth: 330,
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease-in-out",
    backgroundColor: "background.paper",

    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 3,
    },

    "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
        "&:hover": {
            transform: "none",
        },
    },
};
