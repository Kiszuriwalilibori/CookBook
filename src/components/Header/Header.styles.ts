// Header.styles.ts
import { SxProps, Theme } from "@mui/material";

export const overlayStyles: SxProps<Theme> = {
    position: "fixed",
    inset: 0,
    bgcolor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1300,
};

export const modalStyles: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 3,
    maxWidth: 440,
    width: "90%",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: 24,
    outline: "none", // usuwa niebieską ramkę fokusu (dla dostępności)
};

export const googleButtonOverlay: SxProps<Theme> = {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 9999,
};

export const googleButtonWrapper: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "auto",
};

export const logoutButtonWrapper: SxProps<Theme> = {
    position: "fixed",
    top: { xs: 8, sm: 16 },
    right: { xs: 8, sm: 16 },
    zIndex: 1300,
};

export const overlayAnimation: SxProps<Theme> = {
    opacity: 0,
    pointerEvents: "none",
    transition: `opacity var(--duration) ease-in-out`,
    "&[data-state='open']": {
        opacity: 1,
        pointerEvents: "auto",
    },
};

export const visuallyHidden: SxProps<Theme> = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
};

export const closeButtonStyles: SxProps<Theme> = {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
};

export const signinButtonWrapperStyles: SxProps<Theme> = { position: "absolute", top: 12, right: 16, zIndex: 1300 };
