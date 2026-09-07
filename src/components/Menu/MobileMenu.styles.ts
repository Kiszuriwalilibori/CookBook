import { SxProps, Theme } from "@mui/material/styles";

export const mobileMenuIconStyle: SxProps<Theme> = {
    color: theme => theme.custom.menuColor,
    minWidth: "40px",
};

export const mobileMenuItemStyle = (isCurrentItem: boolean, hidden?: boolean): SxProps<Theme> => ({
    color: theme => theme.custom.menuColor,

    backgroundColor: isCurrentItem ? theme => theme.palette.primary.light : "transparent",

    textDecoration: "none",

    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateX(20px)" : "translateX(0)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    pointerEvents: hidden ? "none" : "auto",

    "&:hover": {
        textDecoration: "none",
    },
});

export const mobileMenuItemButtonStyle = (isCurrentItem: boolean, hidden?: boolean): SxProps<Theme> => ({
    ...mobileMenuItemStyle(isCurrentItem, hidden),
});

export const drawerBoxStyle: SxProps<Theme> = {
    width: "100%",
    color: theme => theme.custom.menuColor,
    backgroundColor: theme => theme.palette.primary.main,
};

export const drawerStyle: SxProps<Theme> = {
    display: { md: "none" },

    "& .MuiDrawer-paper": {
        backgroundColor: theme => theme.palette.primary.main,
        color: theme => theme.custom.menuColor,
        width: "100%",
        height: "auto",
        overflowY: "auto",
    },
};
