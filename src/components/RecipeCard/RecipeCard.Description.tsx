import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { styles } from "./styles";
import type { Recipe } from "@/types";

interface RecipeCardDescriptionProps {
    description: Recipe["description"];
}

export const RecipeCardDescription = React.memo(function RecipeCardDescription({ description }: RecipeCardDescriptionProps) {
    const descTitle = useMemo(() => {
        const contentText = description?.firstBlockText?.children?.map(child => child.text).join(" ") || "";

        return description?.title || contentText || "No description available.";
    }, [description]);

    return (
        <Typography variant="body2" sx={styles.description}>
            {descTitle}
        </Typography>
    );
});
