"use client";

import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import { useIsUserLogged } from "@/stores/useAdminStore";
import { RecipeNotesModal } from "@/components";
import { styles } from "../styles";
interface Props {
    recipeId: string;
    userEmail?: string;
    initialNotes?: string;
}

export function RecipeNotesButton({ recipeId, userEmail, initialNotes = "" }: Props) {
    const [open, setOpen] = useState(false);
    const isUserLogged = useIsUserLogged();

    console.log(userEmail, "useremail");
    console.log(isUserLogged, "isUserLogged");
    // jeśli nie ma usera → nie renderuj
    if (!isUserLogged) return null;
    if (!userEmail) return null;

    return (
        <>
            <Tooltip title="Edytuj swoje notatki do przepisu" placement="top">
                <IconButton id="RecipeNotesButton" onClick={() => setOpen(true)} sx={styles.recipeButton}>
                    <NotesIcon sx={{ fontSize: "48px" }} />
                </IconButton>
            </Tooltip>

            <RecipeNotesModal open={open} onClose={() => setOpen(false)} recipeId={recipeId} userEmail={userEmail} initialValue={initialNotes} />
        </>
    );
}

export default RecipeNotesButton;
