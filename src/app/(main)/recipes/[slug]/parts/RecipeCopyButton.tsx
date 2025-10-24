"use client";

import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { useState } from "react";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";

interface RecipeCopyButtonProps {
    recipe: Recipe;
    slug: string;
}

export function RecipeCopyButton({ recipe, slug }: RecipeCopyButtonProps) {
    const [open, setOpen] = useState(false);
    // Configurable base URL - update NEXT_PUBLIC_BASE_URL in .env.local after publishing to Vercel
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const generateCopyableText = (): string => {
        let text = `${recipe.title}\n\n`; // Add recipe title at top
        text += "Składniki:\n";
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ing => {
                text += `- ${ing.quantity} ${ing.name}\n`;
            });
        }
        text += "\nPrzygotowanie:\n";
        if (recipe.preparationSteps && recipe.preparationSteps.length > 0) {
            recipe.preparationSteps.forEach((step, i) => {
                text += `${i + 1}. `;
                if (step.content) {
                    // Simple extraction of text from PortableText; for full rich text, use a serializer
                    step.content.forEach(block => {
                        if (block.children) {
                            block.children.forEach(child => {
                                if (child.text) {
                                    text += child.text + " ";
                                }
                            });
                        }
                    });
                }
                if (step.notes) {
                    text += `(${step.notes})`;
                }
                text += "\n";
            });
        }
        text += `\nŹródło: ${BASE_URL}/recipes/${slug}`; // Add URL at very end
        return text;
    };

    const handleCopy = async () => {
        const text = generateCopyableText();
        try {
            await navigator.clipboard.writeText(text);
            setOpen(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            // Fallback alert if clipboard fails
            alert("Nie udało się skopiować. Spróbuj ponownie.");
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Kopiuj składniki i przygotowanie do dokumentu" placement="top">
                <IconButton
                    id="RecipeCopyButton"
                    onClick={handleCopy}
                    sx={{
                        color: theme => theme.palette.surface.main, // Basic color matching current buttons
                        "&:hover": {
                            color: theme => theme.palette.surface.light, // Hover color matching current
                            backgroundColor: "transparent", // No grey hover background
                            borderRadius: "50%", // Round hover background
                        },
                        ...styles.copyButton, // Reuse responsive/WCAG (fontSize, padding, minHeight, focus-visible)
                    }}
                >
                    <CopyAllIcon sx={{ fontSize: "48px" }} /> {/* Twice bigger icon (default 24px → 48px) */}
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
