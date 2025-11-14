import { SxProps, Theme } from "@mui/material/styles";

const MENU_HEIGHT = 64;

export const navigationStyle: SxProps<Theme> = { flexGrow: 1, height: MENU_HEIGHT };

export const desktopItemStyles = (currentPathname: string, href: string): SxProps<Theme> => ({
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    color: "var(--menu-color)", // Explicitly set to prevent blue
    transition: "background-color 200ms ease",
    cursor: "pointer",
    minWidth: "64px",
    textDecoration: "none", // DODANE: usuwa podkreślenie dla Link
    "&:hover": {
        color: "gray",
        textDecoration: "none", // DODANE: zapobiega podkreśleniu po hover
    },
    height: MENU_HEIGHT,
    backgroundColor: currentPathname === href ? theme => theme.palette.surface.light : "transparent",
});

export const desktopMenuIconStyle: SxProps<Theme> = {
    fontSize: "1.125rem",
    marginRight: "0.5rem",
    color: "var(--menu-color)", // Already set
};

export const desktopMenuLabelStyle: SxProps<Theme> = {
    fontSize: "0.875rem",
    fontFamily: theme => theme.typography.fontFamily,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--menu-color)",
    "&::after": {
        content: "none",
    },
};

export const desktopMenuSeparatorStyle: SxProps<Theme> = {
    height: "1.5rem",
    width: "1px",
    backgroundColor: "var(--menu-color)",
};

export const desktopMenuContainerStyle: SxProps<Theme> = {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    height: "100%",
    animation: "slideInFromLeft 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards",
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
    color: "var(--menu-color)",
    minWidth: "40px",
};

export const mobileMenuItemStyle = (currentPathname: string, href: string): SxProps<Theme> => ({
    color: "var(--menu-color)",
    backgroundColor: currentPathname === href ? theme => theme.palette.surface.light : "transparent",
    textDecoration: "none", // DODANE: usuwa podkreślenie dla ListItem z Link
    "&:hover": {
        textDecoration: "none", // DODANE: zapobiega podkreśleniu po hover
    },
});

export const drawerButtonStyle: SxProps<Theme> = {
    display: { md: "none" },
    color: "var(--menu-color)",
};

export const menuAppBarStyle: SxProps<Theme> = {
    backgroundColor: theme => theme.palette.surface.main,
    color: "var(--menu-color)",
    boxShadow: "none",
    "& .MuiToolbar-root": {
        color: "var(--menu-color)",
    },
    "& .MuiIconButton-root": {
        color: "var(--menu-color)",
    },
};

export const drawerBoxStyle: SxProps<Theme> = {
    width: "100%",
    color: "var(--menu-color)",
    backgroundColor: theme => theme.palette.surface.main,
};

export const drawerStyle: SxProps<Theme> = {
    display: { md: "none" },
    "& .MuiDrawer-paper": {
        backgroundColor: theme => theme.palette.surface.main,
        color: "var(--menu-color)",
        width: "100%",
        height: "auto",
        overflowY: "auto",
    },
};

export const menuToolbarStyle: SxProps<Theme> = {
    justifyContent: { xs: "flex-start", md: "center" },
    paddingY: 0,
    height: "100%",
};
