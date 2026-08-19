import React from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { favoriteIcon } from "./styles";
import { useIsUserSet } from "@/stores/userStore";
import { touchableSx } from "@/styles/utilityStyles";
import LoadingIndicator from "../LoadingIndicator";
import { useDelayedCondition } from "@/hooks/useDelayedCondition";
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
        <IconButton id={"RecipeCard.FavoriteButton"} disabled={disabled || isLoading} onClick={onClick} sx={{ ...favoriteIcon(isFavorite), ...touchableSx }} aria-label={isLoading ? "Aktualizacja ulubionych" : `${isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}`}>
            <FavoriteIcon />
            {showLoading && <LoadingIndicator prompt="Trwa aktualizacja statusu..." />}
        </IconButton>
    );
});
// todo: głupio wygląda w tym miejscu loading ind. ale w rodzicu "skacze, zapewne ze względu na rerendery rodzica"
