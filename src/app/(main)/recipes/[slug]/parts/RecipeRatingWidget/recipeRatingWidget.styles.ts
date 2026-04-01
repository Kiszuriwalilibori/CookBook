import { SxProps, Theme } from "@mui/material";

export const containerSx: SxProps<Theme> = {
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 2,
    border: "1px solid",
    borderColor: "grey.300",
    borderRadius: 2,
    bgcolor: "grey.50",
};

export const textSx: SxProps<Theme> = {
    fontSize: "0.875rem",
    color: "text.secondary",
};

export const averageSx: SxProps<Theme> = {
    fontSize: "1.125rem",
    color: "text.primary",
    fontWeight: 600,
};

export const countSx: SxProps<Theme> = {
    color: "text.secondary",
    fontWeight: 500,
};

export const statusTextSx: SxProps<Theme> = {
    fontSize: "0.75rem",
};

export const loadingSx: SxProps<Theme> = {
    ...statusTextSx,
    color: "primary.main",
};

export const errorSx: SxProps<Theme> = {
    ...statusTextSx,
    color: "error.main",
};

export const successSx: SxProps<Theme> = {
    ...statusTextSx,
    color: "success.main",
    fontWeight: 500,
};
