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

export const columnHeaderSx: SxProps<Theme> = { px: 2, pt: 2, width: "100%", textAlign: "center" };
const columnBaseSx: SxProps<Theme> = {
    flex: 1,
    width: "100%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
};

export const leftColumnSx: SxProps<Theme> = {
    ...columnBaseSx,
    backgroundColor: "#D6E2CF",
    borderRight: { xs: "none", md: "1px solid #ccc" },
};

export const rightColumnSx: SxProps<Theme> = {
    ...columnBaseSx,
    backgroundColor: "#b88e8d",
};
