"use client";

import { IconButton, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { styles } from "../styles";
import { Recipe } from "@/types";

interface RecipePdfButtonProps {
    recipe: Recipe;
    slug: string;
}

const loadRobotoFont = async (): Promise<string> => {
    const response = await fetch("/fonts/Roboto-Regular.ttf");

    if (!response.ok) {
        throw new Error("Nie udało się pobrać fontu Roboto.");
    }

    const fontBuffer = await response.arrayBuffer();
    const fontBytes = new Uint8Array(fontBuffer);

    // Konwersja do Base64 bez ryzyka przepełnienia stosu.
    let binary = "";
    const chunkSize = 0x8000;

    for (let i = 0; i < fontBytes.length; i += chunkSize) {
        const chunk = fontBytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
};

export function RecipePdfButton({ recipe, slug }: RecipePdfButtonProps) {
    const handlePdfExport = async () => {
        try {
            const { default: jsPDF } = await import("jspdf");

            const fontBase64 = await loadRobotoFont();

            const doc = new jsPDF();

            // Rejestracja fontu obsługującego polski alfabet.
            doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto", "normal");

            let yPosition = 25;

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const maxLineWidth = pageWidth - 40;
            const lineHeight = 6;
            const sectionSpacing = 10;
            const bottomMargin = 17;

            const addSectionHeading = (heading: string) => {
                doc.setFontSize(14);
                doc.setFont("Roboto", "normal");

                doc.text(heading, 20, yPosition);

                yPosition += lineHeight + 2;
            };

            const addTextLines = (text: string, fontSize: number) => {
                doc.setFontSize(fontSize);
                doc.setFont("Roboto", "normal");

                const lines = doc.splitTextToSize(text, maxLineWidth);

                lines.forEach((line: string) => {
                    if (yPosition > pageHeight - bottomMargin) {
                        doc.addPage();
                        yPosition = 25;
                    }

                    doc.text(line, 20, yPosition);
                    yPosition += lineHeight;
                });
            };

            // Tytuł przepisu
            addTextLines(recipe.title, 18);
            yPosition += sectionSpacing;

            // Składniki podstawowe
            addSectionHeading("Składniki:");

            if (recipe.ingredients?.length) {
                recipe.ingredients.forEach(ingredient => {
                    const quantityUnit = `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ""}`;

                    const ingredientText = `${ingredient.name} - ${quantityUnit}`;

                    addTextLines(ingredientText, 12);
                });
            }

            // Składniki opcjonalne
            if (recipe.optionalIngredients?.length) {
                yPosition += 4;

                addSectionHeading("Składniki opcjonalne:");

                recipe.optionalIngredients.forEach(ingredient => {
                    const quantityUnit = `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ""}`;

                    const ingredientText = `${ingredient.name} - ${quantityUnit}`;

                    addTextLines(ingredientText, 12);
                });
            }

            yPosition += sectionSpacing;

            // Przygotowanie
            addSectionHeading("Przygotowanie:");

            if (recipe.preparationSteps?.length) {
                recipe.preparationSteps.forEach((step, index) => {
                    let stepText = `${index + 1}. `;

                    if (step.content) {
                        step.content.forEach(block => {
                            if (block.children) {
                                block.children.forEach(child => {
                                    if (child.text) {
                                        stepText += `${child.text} `;
                                    }
                                });
                            }
                        });
                    }

                    if (step.notes) {
                        stepText += `(${step.notes})`;
                    }

                    addTextLines(stepText.trim(), 12);
                    yPosition += 2;
                });
            }

            yPosition += sectionSpacing;

            // Źródło
            addTextLines(`Źródło: https://cook-book-inky.vercel.app/recipes/${slug}`, 10);

            // Zapis PDF
            doc.save(`${slug}.pdf`);
        } catch (error) {
            console.error("PDF generation error:", error);

            alert("Wystąpił błąd podczas generowania PDF. Spróbuj ponownie.");
        }
    };

    return (
        <Tooltip title="Eksportuj do PDF" placement="top">
            <IconButton id="RecipePdfButton" onClick={handlePdfExport} sx={styles.recipeButton} aria-label="Eksportuj przepis do PDF">
                <PictureAsPdfIcon sx={styles.recipeButtonIcon} />
            </IconButton>
        </Tooltip>
    );
}
