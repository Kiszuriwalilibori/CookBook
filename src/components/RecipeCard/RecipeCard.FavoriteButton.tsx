import React from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { favoriteIcon } from "./styles";

interface RecipeCardFavoriteButtonProps {
    isFavorite: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const RecipeCardFavoriteButton = React.memo(function RecipeCardFavoriteButton({ isFavorite, onClick }: RecipeCardFavoriteButtonProps) {
    return (
        <IconButton onClick={onClick} sx={favoriteIcon(isFavorite)}>
            <FavoriteIcon />
        </IconButton>
    );
});
