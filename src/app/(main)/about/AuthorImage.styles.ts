import { SxProps, Theme } from "@mui/material";

export const MIN_SIZE = 100;
export const MAX_SIZE = 200;

export const authorImageWrapperSx: SxProps<Theme> = {
    position: "relative",
    width: {
        xs: MIN_SIZE,
        sm: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
        md: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
        lg: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
        xl: MAX_SIZE,
    },
    height: {
        xs: MIN_SIZE,
        sm: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
        md: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
        lg: `clamp(${MIN_SIZE}px, 16vw, ${MAX_SIZE}px)`,
        xl: MAX_SIZE,
    },
    borderRadius: "50%",
    overflow: "hidden",
    mb: 2,
};
