import { SxProps, Theme } from "@mui/material/styles";

export const MENU_HEIGHT = {
    xs: 56,
    md: 64,
} as const;
export const navigationStyle: SxProps<Theme> = { flexGrow: 0, height: MENU_HEIGHT };

export const desktopItemStyles = (currentPathname: string, href: string, hidden?: boolean): SxProps<Theme> => ({
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    color: theme => `${theme.custom.menuColor}`,
    cursor: "pointer",
    minWidth: "64px",
    textDecoration: "none",
    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateX(20px)" : "translateX(0)",
    transition: hidden
        ? "opacity 0.4s ease, transform 0.4s ease, background-color 200ms ease" // Połączone: dla hidden + zawsze background
        : "background-color 200ms ease",
    pointerEvents: hidden ? "none" : "auto",
    "&:hover": {
        color: "gray",
        textDecoration: "none",
    },
    height: MENU_HEIGHT,
    backgroundColor: currentPathname === href ? theme => theme.palette.primary.light : "transparent",
});

export const desktopMenuIconStyle: SxProps<Theme> = {
    fontSize: "1.125rem",
    marginRight: "0.5rem",
    // color: theme => `${theme.custom.menuColor}`,
    color: theme => `${theme.custom.menuColor}`, // Already set
    "& svg": {
        color: "#000000",
        fill: "#000000",
    },

    "& path": {
        fill: "#000000",
    },
};

export const desktopMenuLabelStyle: SxProps<Theme> = {
    fontSize: "0.875rem",
    fontFamily: theme => theme.typography.fontFamily,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: theme => `${theme.custom.menuColor}`,
    "&::after": {
        content: "none",
    },
};

export const desktopMenuSeparatorStyle: SxProps<Theme> = {
    height: "1.5rem",
    width: "1px",
    backgroundcolor: theme => `${theme.custom.menuColor}`,
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

export const mobileMenuIconStyle: SxProps<Theme> = {
    color: theme => `${theme.custom.menuColor}`,
    minWidth: "40px",
};

export const mobileMenuItemStyle = (currentPathname: string, href: string, hidden?: boolean): SxProps<Theme> => ({
    color: theme => `${theme.custom.menuColor}`,
    backgroundColor: currentPathname === href ? theme => theme.palette.primary.light : "transparent",
    textDecoration: "none",
    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateX(20px)" : "translateX(0)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    pointerEvents: hidden ? "none" : "auto",
    "&:hover": {
        textDecoration: "none",
    },
});

export const drawerButtonStyle: SxProps<Theme> = {
    display: { md: "none" },
    color: theme => `${theme.custom.menuColor}`,
};

export const menuAppBarStyle: SxProps<Theme> = {
    backgroundColor: theme => theme.palette.primary.main,
    color: theme => `${theme.custom.menuColor}`,
    boxShadow: "none",
    "& .MuiToolbar-root": {
        color: theme => `${theme.custom.menuColor}`,
    },
    "& .MuiIconButton-root": {
        color: theme => `${theme.custom.menuColor}`,
    },
};

export const drawerBoxStyle: SxProps<Theme> = {
    width: "100%",
    color: theme => `${theme.custom.menuColor}`,

    backgroundColor: theme => theme.palette.primary.main,
};

export const drawerStyle: SxProps<Theme> = {
    display: { md: "none" },
    "& .MuiDrawer-paper": {
        backgroundColor: theme => theme.palette.primary.main,
        color: theme => `${theme.custom.menuColor}`,
        width: "100%",
        height: "auto",
        overflowY: "auto",
    },
};

export const menuToolbarStyle: SxProps<Theme> = {
    justifyContent: { xs: "flex-start", md: "center" },
    paddingY: 0,
    minHeight: MENU_HEIGHT,
    height: "100%",
    "@media (min-width:0px)": {
        minHeight: MENU_HEIGHT.xs,
    },

    "@media (min-width:900px)": {
        minHeight: MENU_HEIGHT.md,
    },
};
export const mobileMenuItemButtonStyle = (currentPathname: string, hidden?: boolean): SxProps<Theme> => ({
    // Merge mobileMenuItemStyle with button-specific styles
    ...mobileMenuItemStyle(currentPathname, "", hidden),
    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateX(20px)" : "translateX(0)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    pointerEvents: hidden ? "none" : "auto",
});
