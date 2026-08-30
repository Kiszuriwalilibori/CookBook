import { SxProps, Theme } from "@mui/material";
import { BUTTON_HEIGHT } from "./GoogleSignInButton.styles";

export const logoutButton: SxProps<Theme> = {
    position: "fixed",
    top: { xs: 8, sm: 12 },
    right: { xs: 8, sm: 12 },
    zIndex: 1300,

    minHeight: BUTTON_HEIGHT,
    minWidth: 120,

    textTransform: "none",
    borderRadius: 1,
    fontWeight: 500,

    backgroundColor: "secondary.main",
    color: "text.primary",

    "&:hover": {
        backgroundColor: "secondary.dark",
        color: "common.white",
    },

    "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "primary.main",
        outlineOffset: 2,
    },
};
