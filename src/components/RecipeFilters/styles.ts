import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { alpha } from "@mui/material/styles";

export const containerSx: SxProps = {
    maxWidth: 400,
    width: "100%",
    position: "relative",
};

export const fieldBoxSx: SxProps = {
    mb: 2,
};

export const buttonGroupSx: SxProps = {
    display: "flex",
    gap: 1,
    justifyContent: "center",
    flexWrap: "wrap",
};

export const chipContainerSx: SxProps = {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.5,
    maxHeight: 100,
};

export const chipSx = (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.primary.light,
    color: "white",
});

export const hiddenChipSx = (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.primary.light,
    color: "white",
});

export const summaryTextSx = (theme: Theme): SxProps => ({
    mt: 2,
});

export const labelSx = (theme: Theme): SxProps => ({
    "& .MuiOutlinedInput-root": {
        transition: "all 0.2s ease-in-out", // Smooth transition for elegance
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
        },
        "&.Mui-focused": {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`, // Use alpha for safe opacity
        },
    },
    // Subtle label color shift on focus
    "& .MuiInputLabel-root.Mui-focused": {
        color: theme.palette.primary.main,
        transform: "translate(14px, -9px) scale(0.75)", // Standard MUI shrink, but ensure smooth
    },
    // Optional: Hover state for better interactivity
    "&:hover .MuiOutlinedInput-root": {
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.primary.main, 0.5),
        },
    },
});

export const dividerSx = { mb: 2 };
