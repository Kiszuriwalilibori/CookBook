"use client";

import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { useIsAdminLogged } from "@/stores/useAdminStore";
import { useState } from "react";
import { useIsUserSet } from "@/stores/userStore";
import { Recipe } from "@/types";
import { styles } from "../styles";
import { ApiResponse } from "@/models/apiResponse";

interface RecipeCopyButtonProps {
    recipe: Recipe;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function RecipeCopyButton({ recipe }: RecipeCopyButtonProps) {
    const [open, setOpen] = useState(false);
    const [privateNotes, setPrivateNotes] = useState("");
    const isAdminLogged = useIsAdminLogged();
    const hasUser = useIsUserSet();

    const loadPrivateNotes = async (): Promise<string> => {
        if (!hasUser) {
            setPrivateNotes("");
            return "";
        }
        try {
            const response = await fetch(`/api/recipe-notes?recipeId=${recipe._id}`);
            const result: ApiResponse<{ notes: string }> = await response.json();

            if (result.ok) {
                const notes = result.data.notes ?? "";
                setPrivateNotes(notes);
                return notes;
            }

            setPrivateNotes("");
            return "";
        } catch {
            setPrivateNotes("");
            return "";
        }
    };

    const generateCopyableText = (notes = privateNotes): string => {
        let text = `${recipe.title}\n\n`;

        text += "Składniki:\n";
        recipe.ingredients?.forEach(ing => {
            text += `- ${ing.quantity ?? ""}${ing.unit ? ` ${ing.unit}` : ""} ${ing.name}\n`;
        });

        if (recipe.optionalIngredients?.length) {
            text += "\nSkładniki opcjonalne:\n";
            recipe.optionalIngredients.forEach(ing => {
                text += `- ${ing.quantity ?? ""}${ing.unit ? ` ${ing.unit}` : ""} ${ing.name}\n`;
            });
        }

        text += "\nPrzygotowanie:\n";
        recipe.preparationSteps?.forEach((step, i) => {
            text += `${i + 1}. `;

            step.content?.forEach(block => {
                block.children?.forEach(child => {
                    if (child.text) text += `${child.text} `;
                });
            });

            if (step.notes) {
                text += `(${step.notes})`;
            }

            text += "\n";
        });
        if (notes.trim()) {
            text += `\n\nTwoje notatki:\n${notes}`;
        }
        if (isAdminLogged) {
            const slugPath = recipe.slug?.current || "unknown-slug";
            text += `\nŹródło: ${BASE_URL}/recipes/${slugPath}`;
        }
        return text;
    };
    const handleCopy = async () => {
        const notes = await loadPrivateNotes();
        const text = generateCopyableText(notes);
        try {
            await navigator.clipboard.writeText(text);
            setOpen(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            alert("Nie udało się skopiować. Spróbuj ponownie.");
        }
    };

    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="Kopiuj składniki i przygotowanie do dokumentu" placement="top">
                <IconButton disableRipple id="RecipeCopyButton" onClick={handleCopy} sx={styles.recipeButton}>
                    <CopyAllIcon sx={styles.recipeButtonIcon} />
                </IconButton>
            </Tooltip>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    Skopiowano do schowka!
                </Alert>
            </Snackbar>
        </>
    );
}
