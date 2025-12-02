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
export const limitedChipBoxSx = (isScrollable: boolean): SxProps<Theme> => ({
    ...chipContainerSx,
    overflowY: isScrollable ? "auto" : "visible",
});

// export const popupIndicatorSx: SxProps<Theme> = {
//     color: "var(--foreground)",
// };

// export const clearIndicatorSx: SxProps<Theme> = {
//     color: "var(--foreground)",
// };

// export const highlightSx: SxProps<Theme> = theme => ({
//     backgroundColor: theme.palette.secondary.light,
//     color: theme.palette.secondary.contrastText,
//     px: 0.5,
//     borderRadius: 0.5,
//     fontWeight: 600,
// });

export const popupIndicatorSx: SxProps<Theme> = {
    color: "var(--foreground)",
};

export const clearIndicatorSx: SxProps<Theme> = {
    color: "var(--foreground)",
};

// This is now a static object — no function!
export const highlightSx: SxProps<Theme> = {
    backgroundColor: "secondary.light",
    color: "secondary.contrastText",
    px: 0.5,
    borderRadius: 0.5,
    fontWeight: 600,
};

// tooltipStyles.ts

export const filterSummaryTooltipSx: SxProps<Theme> = theme => ({
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.common.white,
});

export const filterSummaryTooltipArrowSx: SxProps<Theme> = theme => ({
    "&:before": {
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.common.white,
    },
});

export const summaryItemTextSx = {
    color: "inherit",
};