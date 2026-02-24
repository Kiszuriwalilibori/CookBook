"use client";

import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import { useIsUserLogged } from "@/stores/useAdminStore";
import { styles } from "../styles";
import RecipeNotesModal from "@/components/RecipeNotesModal";


export function RecipeNotesButton() {
    const isUserLogged = useIsUserLogged();
    const [open, setOpen] = useState(false);

    if (!isUserLogged) return null;

    return (
        <>
            <Tooltip title="Edytuj swoje notatki do przepisu" placement="top">
                <IconButton id="RecipeNotesButton" onClick={() => setOpen(true)} sx={styles.recipeButton}>
                    <NotesIcon sx={{ fontSize: "48px" }} />
                </IconButton>
            </Tooltip>

            <RecipeNotesModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}

export default RecipeNotesButton;
