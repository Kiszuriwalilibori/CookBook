import { SxProps, Theme } from "@mui/material";

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
        borderBottom: "1px solid",
        borderColor: "divider",
    },

    preparationProgressLabel: {
        flexShrink: 0,
        fontWeight: 600,
        whiteSpace: "nowrap",
    },

    preparationProgress: {
        flex: 1,
        minWidth: 0,
    },
};
