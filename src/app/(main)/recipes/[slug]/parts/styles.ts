import { SxProps, Theme } from "@mui/material";

export const recipeCopyButtonSx: SxProps<Theme> = {
    color: theme => theme.palette.surface.main, // Base color
    "&:hover": {
        color: theme => theme.palette.surface.light, // Hover color
        backgroundColor: "transparent", // No grey background
        borderRadius: "50%", // Round hover effect
    },
    fontSize: { xs: "36px", md: "48px" }, // Example responsive icon sizing
    padding: 1,
    minHeight: 0, // To match your previous WCAG-friendly style
};
