import { SxProps, Theme } from "@mui/material/styles";

export const MENU_HEIGHT = {
    xs: 56,
    md: 64,
} as const;

export const navigationStyle: SxProps<Theme> = {
    flexGrow: 0,
    height: MENU_HEIGHT,
};

export const drawerButtonStyle: SxProps<Theme> = {
    display: { md: "none" },
    color: theme => theme.custom.menuColor,
};

export const menuAppBarStyle: SxProps<Theme> = {
    backgroundColor: theme => theme.palette.primary.main,
    color: theme => theme.custom.menuColor,
    boxShadow: "none",

    "& .MuiToolbar-root": {
        color: theme => theme.custom.menuColor,
    },

    "& .MuiIconButton-root": {
        color: theme => theme.custom.menuColor,
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
