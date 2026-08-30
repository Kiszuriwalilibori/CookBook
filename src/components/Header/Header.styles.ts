// Header.styles.ts
import { SxProps, Theme } from "@mui/material";

export const overlayAnimation: SxProps<Theme> = {
    opacity: 0,
    pointerEvents: "none",
    transition: `opacity var(--duration) ease-in-out`,
    "&[data-state='open']": {
        opacity: 1,
        pointerEvents: "auto",
    },
};

export const signinButtonWrapperStyles: SxProps<Theme> = { position: "absolute", top: 12, right: 16, zIndex: 1300 };
