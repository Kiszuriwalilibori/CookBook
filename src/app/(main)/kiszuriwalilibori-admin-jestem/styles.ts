import { SxProps, Theme } from "@mui/material";

export const signinButtonWrapperStyles: SxProps<Theme> = { position: "absolute", top: 12, right: 16, zIndex: 1300 };
export const closeButtonSx: SxProps<Theme> = {
    textTransform: "none",
    backgroundColor: "#fff",
    color: "rgba(0,0,0,0.87)",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "6px",
    py: 1,
    fontWeight: 400,
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    "&:hover": {
        backgroundColor: "#f7f7f7",
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    },
};

export const logoutButtonWrapper: SxProps<Theme> = {
    position: "fixed",
    top: { xs: 8, sm: 16 },
    right: { xs: 8, sm: 16 },
    zIndex: 1300,
};
