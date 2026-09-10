import { SxProps, Theme } from "@mui/material/styles";

export const desktopItemStyles = (isCurrentItem: boolean, hidden?: boolean): SxProps<Theme> => ({
    display: "flex",
    alignItems: "center",
    py: 1,
    px: 2,
    color: theme => theme.custom.menuColor,
    cursor: "pointer",
    minWidth: "64px",
    textDecoration: "none",
    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateX(20px)" : "translateX(0)",
    transition: hidden ? "opacity 0.4s ease, transform 0.4s ease, background-color 200ms ease" : "background-color 200ms ease",
    pointerEvents: hidden ? "none" : "auto",
    height: { xs: 56, md: 64 },

    backgroundColor: isCurrentItem ? theme => theme.palette.secondary.light : "transparent",

    "&:hover": {
        backgroundColor: theme => theme.palette.primary.light,
        textDecoration: "none",
    },
});

export const desktopMenuIconStyle: SxProps<Theme> = {
    fontSize: "1.125rem",
    marginRight: "0.5rem",
    color: theme => theme.custom.menuColor,
};

export const desktopMenuLabelStyle: SxProps<Theme> = {
    fontSize: "0.875rem",
    fontFamily: theme => theme.typography.fontFamily,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: theme => theme.custom.menuColor,

    "&::after": {
        content: "none",
    },
};

export const desktopMenuSeparatorStyle: SxProps<Theme> = {
    height: "1.5rem", // todo jakbym chciał na całą wysokośc to MENU_HEIGHT
    width: "1px",
    backgroundColor: theme => theme.palette.primary.dark,
};

export const desktopMenuContainerStyle: SxProps<Theme> = {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    height: "100%",
    margin: "0 auto",

    animation: "slideInFromLeft 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards",

    "@media (prefers-reduced-motion: reduce)": {
        animation: "none",
    },

    "@keyframes slideInFromLeft": {
        from: {
            transform: "translateX(-100%)",
            opacity: 0,
        },
        "50%": {
            opacity: 0.5,
        },
        to: {
            transform: "translateX(0)",
            opacity: 1,
        },
    },
};
