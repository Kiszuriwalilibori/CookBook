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
    p: 4,
    borderRadius: 3,
    maxWidth: 440,
    width: "90%",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: 24,
    outline: "none", // usuwa niebieską ramkę fokusu (dla dostępności)
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
