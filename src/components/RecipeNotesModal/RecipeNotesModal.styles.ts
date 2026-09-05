import { SxProps, Theme } from "@mui/material";

export const recipeNotesModalStyles = {
    backdrop: {
        bgcolor: "rgba(0,0,0,0.5)",
    },

    counterText: {
        fontSize: "0.875rem",
        color: "text.secondary",
        textAlign: "right",
    },
};
export const modalStyles: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    bgcolor: "background.paper",
    p: 3,

    borderRadius: 3,

    width: "90%",
    maxWidth: 440,

    boxShadow: 24,
    outline: "none",
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
