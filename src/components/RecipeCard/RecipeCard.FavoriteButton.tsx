import React from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { favoriteIcon } from "./styles";
import { useIsUserSet } from "@/stores/userStore";
interface RecipeCardFavoriteButtonProps {
    disabled?: boolean;
    isFavorite: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const RecipeCardFavoriteButton = React.memo(function RecipeCardFavoriteButton({ disabled, isFavorite, onClick }: RecipeCardFavoriteButtonProps) {
    const isUserSet = useIsUserSet();

    if (!isUserSet) return null;
    return (
        <IconButton disabled={disabled} onClick={onClick} sx={favoriteIcon(isFavorite)} aria-label={`${isFavorite ? "Remove from" : "Add to"} favorites`}>
            <FavoriteIcon />
        </IconButton>
    );
});
