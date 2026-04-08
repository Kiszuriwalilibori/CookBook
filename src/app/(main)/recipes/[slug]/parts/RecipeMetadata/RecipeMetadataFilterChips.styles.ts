import { SxProps, Theme, alpha } from "@mui/material";

export const containerStyles: SxProps<Theme> = {
    display: "inline-flex",
    gap: 0.5,
    flexWrap: "wrap",
    ml: 0.5,
};

export const chipStyles: SxProps<Theme> = theme => ({
    textTransform: "none",
    "&:hover": {
        backgroundColor: alpha(theme.palette.secondary.main, 0.6),
    },
});
