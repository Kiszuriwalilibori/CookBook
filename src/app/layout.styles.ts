// app/layout.styles.ts
import { SxProps, Theme } from "@mui/material";

export const layoutContainerStyles: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    // backgroundColor: "background.paper",
};

export const mainContentStyles: SxProps<Theme> = {
    flexGrow: 1,
};
