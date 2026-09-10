import React from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useIsUserSet } from "@/stores/userStore";
import { touchableSx } from "@/styles/utilityStyles";
import LoadingIndicator from "../LoadingIndicator";
import { useDelayedCondition } from "@/hooks/useDelayedCondition";
import { favoriteButtonSx } from "./RecipeCard.FavoriteButton.styles";
interface RecipeCardFavoriteButtonProps {
    isLoading: boolean;
    disabled?: boolean;
    isFavorite: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const RecipeCardFavoriteButton = React.memo(function RecipeCardFavoriteButton({ disabled, isFavorite, onClick, isLoading }: RecipeCardFavoriteButtonProps) {
    const isUserSet = useIsUserSet();

    const showLoading = useDelayedCondition(isLoading, 500, 1000);

    if (!isUserSet) return null;
    return (
        <IconButton id={"RecipeCard.FavoriteButton"} disabled={disabled || isLoading} onClick={onClick} sx={{ ...favoriteButtonSx(isFavorite), ...touchableSx }} aria-label={isLoading ? "Aktualizacja ulubionych" : `${isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}`}>
            <FavoriteIcon />
            {showLoading && <LoadingIndicator prompt="Trwa aktualizacja statusu..." />}
        </IconButton>
    );
});
