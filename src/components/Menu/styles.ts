import { SxProps, Theme } from "@mui/material/styles";

const MENU_HEIGHT = 64;

export const desktopItemStyles = (currentPathname: string, href: string): SxProps<Theme> => ({
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    color: "var(--menu-color)", // Explicitly set to prevent blue
    transition: "background-color 200ms ease",
    cursor: "pointer",
    minWidth: "64px",
    "&:hover": {
        color: "gray",
    },
    height: MENU_HEIGHT,
    backgroundColor: currentPathname === href ? "#FFFAE0" : "transparent",
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
    color: "var(--menu-color)", // Already set
    "&::after": {
        content: "none",
    },
};

export const desktopMenuSeparatorStyle: SxProps<Theme> = {
    height: "1.5rem",
    width: "1px",
    backgroundColor: "var(--menu-color)", // Already set
};

export const desktopMenuContainerStyle: SxProps<Theme> = {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    height: "100%",
    animation: "slideInFromLeft 0.5s ease-out forwards",
    "@keyframes slideInFromLeft": {
        from: {
            transform: "translateX(-100%)",
            opacity: 0,
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

export const drawerButtonStyle: SxProps<Theme> = {
    display: { md: "none" },
    color: "var(--menu-color)",
};

export const menunuAppBarStyle: SxProps<Theme> = {
    backgroundColor: theme => theme.palette.surface.main,
    color: "var(--menu-color)",
    boxShadow: "none",
    borderBottom: "1px solid #e5e7eb",
    "& .MuiToolbar-root": {
        color: "var(--menu-color)",
    },
    "& .MuiIconButton-root": {
        color: "var(--menu-color)",
    },
};

export const drawerStyle: SxProps<Theme> = {
    width: 250,
    color: "var(--menu-color)",
    backgroundColor: theme => theme.palette.surface.main,
};
