"use client";

import { Button } from "@mui/material";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";

interface RecipeCopyButtonProps {
    recipe: Recipe;
}

export function RecipeCopyButton({ recipe }: RecipeCopyButtonProps) {
    const generateCopyableText = (): string => {
        let text = "Składniki:\n";
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
        return text;
    };

    const handleCopy = async () => {
        const text = generateCopyableText();
        await navigator.clipboard.writeText(text);
        // Optional: Add snackbar/toast for feedback
        alert("Skopiowano składniki i kroki przygotowania do schowka!");
    };

    return (
        <Button variant="outlined" onClick={handleCopy} sx={styles.copyButton}>
            Kopiuj składniki i przygotowanie do dokumentu
        </Button>
    );
}
