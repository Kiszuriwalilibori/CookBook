"use client";

import { IconButton, Tooltip } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styles } from "../styles";

export function RecipeCommentsButton() {
    return (
        <Tooltip title="Pokaż komentarze" placement="top">
            <IconButton
                id="RecipeCommentsButton"
                onClick={() => {
                    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
                }}
                sx={styles.recipeButton}
            >
                <ChatBubbleOutlineIcon sx={styles.recipeButtonIcon} />
            </IconButton>
        </Tooltip>
    );
}
