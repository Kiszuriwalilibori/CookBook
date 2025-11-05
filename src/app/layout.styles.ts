// app/layout.styles.ts
import { SxProps, Theme } from "@mui/material";

export const layoutContainerStyles: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
};

export const mainContentStyles: SxProps<Theme> = {
    flexGrow: 1,
};
