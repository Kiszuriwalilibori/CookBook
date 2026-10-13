"use client";

import { IconButton, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { styles } from "../styles";
import { Recipe } from "@/types";

interface RecipePdfButtonProps {
    recipe: Recipe;
    slug: string;
}

export function RecipePdfButton({ recipe, slug }: RecipePdfButtonProps) {
    const normalizePolishText = (text: string): string => {
        return text
            .replace(/ą/g, "a")
            .replace(/Ą/g, "A")
            .replace(/ć/g, "c")
            .replace(/Ć/g, "C")
            .replace(/ę/g, "e")
            .replace(/Ę/g, "E")
            .replace(/ł/g, "l")
            .replace(/Ł/g, "L")
            .replace(/ń/g, "n")
            .replace(/Ń/g, "N")
            .replace(/ó/g, "o")
            .replace(/Ó/g, "O")
            .replace(/ś/g, "s")
            .replace(/Ś/g, "S")
            .replace(/ź/g, "z")
            .replace(/Ź/g, "Z")
            .replace(/ż/g, "z")
            .replace(/Ż/g, "Z")
            .trim();
    };

    const handlePdfExport = async () => {
        try {
            const { default: jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            let yPosition = 25;
            const pageWidth = doc.internal.pageSize.getWidth();
            const maxLineWidth = pageWidth - 40;
            const lineHeight = 6;
            const sectionSpacing = 10;

            doc.setFont("helvetica", "normal");

            const addSectionHeading = (heading: string) => {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text(heading, 20, yPosition);
                yPosition += lineHeight + 2;
            };

            const addTextLines = (text: string, fontSize: number, fontStyle: "normal" | "bold" | "italic" = "normal") => {
                doc.setFontSize(fontSize);
                doc.setFont("helvetica", fontStyle);

                const lines = doc.splitTextToSize(text, maxLineWidth);

                lines.forEach((line: string) => {
                    if (yPosition > 280) {
                        doc.addPage();
                        yPosition = 25;
                    }

                    doc.text(line, 20, yPosition);
                    yPosition += lineHeight;
                });
            };

            // Tytuł
            addTextLines(normalizePolishText(recipe.title), 18, "bold");
            yPosition += sectionSpacing;

            // Składniki podstawowe
            addSectionHeading("Skladniki:");

            if (recipe.ingredients && recipe.ingredients.length > 0) {
                recipe.ingredients.forEach(ingredient => {
                    const quantityUnit = `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ""}`;
                    const ingredientText = normalizePolishText(`${ingredient.name} - ${quantityUnit}`);

                    addTextLines(ingredientText, 12);
                });
            }

            // Składniki opcjonalne
            if (recipe.optionalIngredients && recipe.optionalIngredients.length > 0) {
                yPosition += 4;
                addSectionHeading("Skladniki opcjonalne:");

                recipe.optionalIngredients.forEach(ingredient => {
                    const quantityUnit = `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ""}`;
                    const ingredientText = normalizePolishText(`${ingredient.name} - ${quantityUnit}`);

                    addTextLines(ingredientText, 12);
                });
            }

            yPosition += sectionSpacing;

            // Przygotowanie
            addSectionHeading("Przygotowanie:");

            if (recipe.preparationSteps && recipe.preparationSteps.length > 0) {
                recipe.preparationSteps.forEach((step, index) => {
                    let stepText = `${index + 1}. `;

                    if (step.content) {
                        step.content.forEach(block => {
                            if (block.children) {
                                block.children.forEach(child => {
                                    if (child.text) {
                                        stepText += `${normalizePolishText(child.text)} `;
                                    }
                                });
                            }
                        });
                    }

                    if (step.notes) {
                        stepText += `(${normalizePolishText(step.notes)})`;
                    }

                    addTextLines(stepText.trim(), 12);
                    yPosition += 2;
                });
            }

            yPosition += sectionSpacing;

            // Źródło
            addTextLines(`Zrodlo: https://cook-book-inky.vercel.app/recipes/${slug}`, 10, "italic");

            doc.save(`${slug}.pdf`);
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Blad podczas generowania PDF. Sprobuj ponownie.");
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
