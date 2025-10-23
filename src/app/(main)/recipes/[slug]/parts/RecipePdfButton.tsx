// app/recipes/[slug]/parts/RecipePdfButton.tsx (cleaned: no comments/logs)
"use client";

import { Button } from "@mui/material";
import jsPDF from "jspdf";
import { styles } from "../styles";
import { Recipe } from "@/lib/types";

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

    const handlePdfExport = () => {
        try {
            const doc = new jsPDF();
            let yPosition = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const maxLineWidth = pageWidth - 40;

            const useCustomFont = false;

            doc.setFont("helvetica");

            doc.setFontSize(18);
            doc.setFont(undefined, "bold");
            const titleText = useCustomFont ? recipe.title : normalizePolishText(recipe.title);
            const titleLines = doc.splitTextToSize(titleText, maxLineWidth);
            titleLines.forEach((line: string) => {
                doc.text(line, 20, yPosition);
                yPosition += 7;
            });
            yPosition += 10;

            doc.setFontSize(14);
            doc.setFont(undefined, "bold");
            const skladnikiText = useCustomFont ? "Składniki:" : "Skladniki:";
            doc.text(skladnikiText, 20, yPosition);
            yPosition += 8;

            if (recipe.ingredients && recipe.ingredients.length > 0) {
                doc.setFontSize(12);
                doc.setFont(undefined, "normal");
                recipe.ingredients.forEach(ing => {
                    const normalizedIng = useCustomFont ? `${ing.quantity} ${ing.name}` : normalizePolishText(`${ing.quantity} ${ing.name}`);
                    const ingText = `- ${normalizedIng}`;
                    const ingLines = doc.splitTextToSize(ingText, maxLineWidth);
                    ingLines.forEach((line: string) => {
                        if (yPosition > 280) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        doc.text(line, 20, yPosition);
                        yPosition += 6;
                    });
                });
            }
            yPosition += 10;

            doc.setFontSize(14);
            doc.setFont(undefined, "bold");
            doc.text("Przygotowanie:", 20, yPosition);
            yPosition += 8;

            if (recipe.preparationSteps && recipe.preparationSteps.length > 0) {
                doc.setFontSize(12);
                doc.setFont(undefined, "normal");
                recipe.preparationSteps.forEach((step, i) => {
                    let stepText = `${i + 1}. `;
                    if (step.content) {
                        step.content.forEach(block => {
                            if (block.children) {
                                block.children.forEach(child => {
                                    if (child.text) {
                                        stepText += (useCustomFont ? child.text : normalizePolishText(child.text)) + " ";
                                    }
                                });
                            }
                        });
                    }
                    if (step.notes) {
                        stepText += `(${useCustomFont ? step.notes : normalizePolishText(step.notes)})`;
                    }

                    const stepLines = doc.splitTextToSize(stepText.trim(), maxLineWidth);
                    stepLines.forEach((line: string) => {
                        if (yPosition > 280) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        doc.text(line, 20, yPosition);
                        yPosition += 6;
                    });
                    yPosition += 2;
                });
            }

            yPosition += 10;
            doc.setFontSize(10);
            doc.setFont(undefined, "italic");
            const zrodloText = useCustomFont ? "Źródło:" : "Zrodlo:";
            doc.text(`${zrodloText} https://yourdomain.com/recipes/${slug}`, 20, yPosition);

            doc.save(`${slug}.pdf`);
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Błąd podczas generowania PDF. Sprawdź konsolę.");
        }
    };

    return (
        <Button
            id="RecipePdfButton"
            variant="outlined"
            onClick={handlePdfExport}
            sx={{
                ...styles.copyButton,
                ml: 2,
                color: theme => theme.palette.surface.main,
                borderColor: theme => theme.palette.surface.main,
                "&:hover": {
                    borderColor: theme => theme.palette.surface.light,
                    color: theme => theme.palette.surface.light,
                    backgroundColor: theme => theme.palette.action.hover,
                },
            }}
        >
            Eksportuj do PDF
        </Button>
    );
}
