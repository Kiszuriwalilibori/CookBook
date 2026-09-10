import type { SxProps, Theme } from "@mui/material";

export const imageWrapperStyles: SxProps<Theme> = {
    position: "relative",
    height: { xs: 180, sm: 200 },
    overflow: "hidden",

    "& img": {
        transition: "transform 0.3s ease-in-out",
    },

    "&:hover img": {
        transform: "scale(1.05)",
    },
};
