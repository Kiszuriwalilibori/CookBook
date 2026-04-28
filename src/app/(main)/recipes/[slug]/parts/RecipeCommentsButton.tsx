"use client";

import { IconButton, Tooltip } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styles } from "../styles";

interface RecipeCommentsButtonProps {
    onClick: () => void;
}

export function RecipeCommentsButton({ onClick }: RecipeCommentsButtonProps) {
    return (
        <Tooltip title="Pokaż komentarze" placement="top">
            <IconButton id="RecipeCommentsButton" onClick={onClick} sx={styles.recipeButton}>
                <ChatBubbleOutlineIcon sx={styles.recipeButtonIcon} />
            </IconButton>
        </Tooltip>
    );
}
