import { SxProps, Theme } from "@mui/material";

export const containerStyles: SxProps<Theme> = {
    mt: 4,
};

export const textStyles: SxProps<Theme> = {
    mt: 1,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    backgroundColor: theme => theme.palette.background.default,
    borderRadius: "8px",
    padding: 2,
};
