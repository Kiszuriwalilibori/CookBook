import React from "react";
import { Typography } from "@mui/material";

import { titleStyles } from "./RecipeCard.Title.styles";

interface RecipeCardTitleProps {
    title: string;
}

export const RecipeCardTitle = React.memo(function RecipeCardTitle({ title }: RecipeCardTitleProps) {
    return (
        <Typography variant="h6" component="h2" gutterBottom sx={titleStyles} aria-label={title} title={title}>
            {title}
        </Typography>
    );
});
