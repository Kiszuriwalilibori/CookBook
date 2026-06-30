"use client";

import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import { RecipeNotesModal } from "@/components";
import { useIsUserSet } from "@/stores/userStore";
import { styles } from "../styles";
interface Props {
    recipeId: string;
    initialNotes?: string;
}

export function RecipeNotesButton({ recipeId, initialNotes = "" }: Props) {
    const [open, setOpen] = useState(false);

    // jeśli nie ma usera → nie renderuj
    const hasUser = useIsUserSet();
    if (!hasUser) return null;

    return (
        <>
            <Tooltip title="Edytuj swoje notatki do przepisu" placement="top">
                <IconButton id="RecipeNotesButton" onClick={() => setOpen(true)} sx={styles.recipeButton}>
                    <NotesIcon sx={styles.recipeButtonIcon} />
                </IconButton>
            </Tooltip>

            <RecipeNotesModal open={open} onClose={() => setOpen(false)} recipeId={recipeId} initialValue={initialNotes} />
        </>
    );
}

export default RecipeNotesButton;
