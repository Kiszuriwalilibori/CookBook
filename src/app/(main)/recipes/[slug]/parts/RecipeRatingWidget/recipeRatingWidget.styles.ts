import { SxProps, Theme } from "@mui/material";

// ------------------------
// Stała bazowa dla tekstów
// ------------------------
export const baseTextSx: SxProps<Theme> = (theme: Theme) => ({
    fontFamily: "Inter, sans-serif",
    color: theme.palette.text.primary,
    textAlign: "center",
    fontWeight: 400,
    fontSize: {
        xs: "16px",
        sm: "17px",
        md: "18px",
    },
});

// ------------------------
// Kontener widgetu
// ------------------------
export const containerSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "row", // poziomo
    alignItems: "center",
    justifyContent: "center",
    gap: 1.5,
    flexWrap: "wrap",
    p: 0,
    border: "none",
    bgcolor: "transparent",
};

// ------------------------
// Teksty w widgetcie
// ------------------------
export const textSx: SxProps<Theme> = {
    ...baseTextSx,
};

export const averageSx: SxProps<Theme> = {
    ...baseTextSx,
};

export const countSx: SxProps<Theme> = {
    ...baseTextSx,
};

// ------------------------
// Status messages
// ------------------------
const statusTextSx: SxProps<Theme> = {
    ...baseTextSx,
};

export const errorSx: SxProps<Theme> = {
    ...statusTextSx,
    color: theme => theme.palette.error.main,
};
export const successSx: SxProps<Theme> = {
    ...baseTextSx,

    color: theme => theme.palette.success.main,
    fontWeight: 500,
};

export const loaderContainerSx: SxProps<Theme> = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mt: 1,
};