import { SxProps, Theme } from "@mui/material";
import { design } from "@/themes/design";
const { radius } = design;

export const styles: { [key: string]: SxProps<Theme> } = {
    preparationProgressBar: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.5,
        px: 2,
        mb: 2,
        backgroundColor: "background.paper",
        border: "1px solid",
        // borderColor: "divider",
        borderRadius: radius.md,
    },

    preparationProgressLabel: {
        flexShrink: 0,
        fontWeight: 600,
        whiteSpace: "nowrap",
    },

    preparationProgress: {
        flex: 1,
        minWidth: 0,
        "@media (prefers-reduced-motion: reduce)": {
            "& .MuiLinearProgress-bar": {
                transition: "none",
            },
        },
    },
};
