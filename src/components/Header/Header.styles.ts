// Header.styles.ts
import { SxProps, Theme } from "@mui/material";

export const overlayStyles: SxProps<Theme> = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    bgcolor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1300,
};

export const modalStyles: SxProps<Theme> = {
    bgcolor: "background.paper",
    p: 3,
    borderRadius: 1,
    maxWidth: 400,
    width: "90%",
    maxHeight: "80%",
    overflowY: "auto",
    boxShadow: 24,
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