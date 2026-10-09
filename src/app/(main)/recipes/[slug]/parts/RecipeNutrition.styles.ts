import { SxProps, Theme } from "@mui/material";

export const recipeNutritionAccordion: SxProps<Theme> = {
    mt: 4,
    "&:before": {
        display: "none",
    },
};

export const recipeNutritionSectionCell: SxProps<Theme> = {
    fontWeight: "bold",
    bgcolor: "action.hover",
};
