// page.styles.ts
import type { SxProps, Theme } from "@mui/material/styles";

export const pageRootSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
};

export const contentWrapperSx: SxProps<Theme> = {
    display: "flex",
    flex: 1,
    flexDirection: { xs: "column", md: "row" },
    width: "100%",
};

export const leftColumnSx: SxProps<Theme> = {
    flex: 1,
    borderRight: { xs: "none", md: "1px solid #ccc" },
};

export const rightColumnSx: SxProps<Theme> = {
    flex: 1,
};
