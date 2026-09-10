import { SxProps, Theme } from "@mui/material";
import { design } from "@/themes/design";
const { radius } = design;

export const BUTTON_HEIGHT = 40;

export const signinButtonWrapperStyles: SxProps<Theme> = {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 1300,
};

export const googleSignInPaperSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    width: { xs: "100%", sm: "auto" },
    alignItems: "center",
    gap: 1,
    backgroundColor: "transparent",

    "& #google-signin-button": {
        minHeight: BUTTON_HEIGHT,
        display: "flex",
        alignItems: "center",
    },
};

export const googleSignInStatusSx: SxProps<Theme> = {
    position: "absolute",
    left: -9999,
};

export const closeButtonSx: SxProps<Theme> = {
    height: 40,
    minHeight: 40,
    minWidth: 190,

    textTransform: "none",
    backgroundColor: "background.default",
    color: "text.primary",

    border: 1,
    borderColor: "divider",
    borderRadius: radius.sm,

    px: 2,
    py: 0,

    fontWeight: 400,
    fontSize: "0.875rem",

    "&:hover": {
        backgroundColor: "secondary.light",
        borderColor: "secondary.main",
    },

    "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "primary.main",
        outlineOffset: 2,
    },
};
