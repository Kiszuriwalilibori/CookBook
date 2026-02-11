import React from "react";
import { Typography } from "@mui/material";
import { styles } from "./styles";

interface RecipeCardTitleProps {
    title: string;
}

export const RecipeCardTitle = React.memo(function RecipeCardTitle({ title }: RecipeCardTitleProps) {
    return (
        <Typography variant="h6" gutterBottom sx={styles.title}>
            {title}
        </Typography>
    );
});
