"use client";

import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { useState } from "react";
import { Recipe } from "@/types";
import { styles } from "../styles";

interface RecipeCopyButtonProps {
    recipe: Recipe;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function RecipeCopyButton({ recipe }: RecipeCopyButtonProps) {
    const [open, setOpen] = useState(false);

    const generateCopyableText = (): string => {
        let text = `${recipe.title}\n\n`;

        // Ingredients
        text += "Składniki:\n";
        recipe.ingredients?.forEach(ing => {
            text += `- ${ing.quantity}${ing.unit ? ` ${ing.unit}` : ""} ${ing.name}\n`;
        });

        // Preparation steps
        text += "\nPrzygotowanie:\n";
        recipe.preparationSteps?.forEach((step, i) => {
            text += `${i + 1}. `;
            if (step.content) {
                step.content.forEach(block => {
                    block.children?.forEach(child => {
                        if (child.text) text += child.text + " ";
                    });
                });
            }
            if (step.notes) {
                text += `(${step.notes})`;
            }
            text += "\n";
        });

        // Recipe URL (internal)
        const slugPath = recipe.slug?.current || "unknown-slug";
        text += `\nŹródło: ${BASE_URL}/recipes/${slugPath}`;

        return text;
    };

    const handleCopy = async () => {
        const text = generateCopyableText();
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
                <IconButton
                    id="RecipeCopyButton"
                    onClick={handleCopy}
                    sx={styles.recipeButton}
                    
                >
                    <CopyAllIcon sx={{ fontSize: "48px" }} />
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
