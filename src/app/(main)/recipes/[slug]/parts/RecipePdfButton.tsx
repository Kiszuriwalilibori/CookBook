"use client";

import { IconButton, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import { styles } from "../styles";
import { Recipe } from "@/types";

interface RecipePdfButtonProps {
    recipe: Recipe;
    slug: string;
}

export function RecipePdfButton({ recipe, slug }: RecipePdfButtonProps) {
    const normalizePolishText = (text: string): string => {
        return (
            text
                .replace(/ą/g, "a")
                .replace(/Ą/g, "A")
                .replace(/ć/g, "c")
                .replace(/Ć/g, "C")
                .replace(/ę/g, "e")
                .replace(/Ę/g, "E")
                // .replace(/ł/g, "l")
                // .replace(/Ł/g, "L")
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
                .trim()
        );
    };

    const handlePdfExport = () => {
        try {
            const doc = new jsPDF();
            let yPosition = 25; // lekko niżej od góry
            const pageWidth = doc.internal.pageSize.getWidth();
            const maxLineWidth = pageWidth - 40; // margines 20mm z każdej strony

            const lineHeight = 6; // wysokość jednej linii tekstu
            const sectionSpacing = 10; // odstęp między sekcjami

            const useCustomFont = false;
            doc.setFont("helvetica");

            // --- Tytuł ---
            doc.setFontSize(18);
            doc.setFont(undefined, "bold");
            const titleText = useCustomFont ? recipe.title : normalizePolishText(recipe.title);
            const titleLines = doc.splitTextToSize(titleText, maxLineWidth);
            titleLines.forEach((line: string) => {
                doc.text(line, 20, yPosition);
                yPosition += lineHeight + 1;
            });
            yPosition += sectionSpacing;

            // --- Składniki ---
            doc.setFontSize(14);
            doc.setFont(undefined, "bold");
            const skladnikiText = useCustomFont ? "Składniki:" : "Skladniki:";
            doc.text(skladnikiText, 20, yPosition);
            yPosition += lineHeight + 2;

            if (recipe.ingredients && recipe.ingredients.length > 0) {
                doc.setFontSize(12);
                doc.setFont(undefined, "normal");
                recipe.ingredients.forEach(ing => {
                    const quantityUnit = `${ing.quantity}${ing.unit ? ` ${ing.unit}` : ""}`;
                    const normalizedIng = useCustomFont ? `${ing.name} - ${quantityUnit}` : normalizePolishText(`${ing.name} - ${quantityUnit}`);

                    // Próbujemy utrzymać składnik w jednym wierszu, jeśli się mieści
                    const ingLines = doc.splitTextToSize(normalizedIng, maxLineWidth);
                    ingLines.forEach((line: string) => {
                        if (yPosition > 280) {
                            doc.addPage();
                            yPosition = 25;
                        }
                        doc.text(line, 20, yPosition);
                        yPosition += lineHeight;
                    });
                });
            }
            yPosition += sectionSpacing;

            // --- Przygotowanie ---
            doc.setFontSize(14);
            doc.setFont(undefined, "bold");
            doc.text("Przygotowanie:", 20, yPosition);
            yPosition += lineHeight + 2;

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
                            yPosition = 25;
                        }
                        doc.text(line, 20, yPosition);
                        yPosition += lineHeight;
                    });
                    yPosition += 2;
                });
            }
            yPosition += sectionSpacing;

            // --- Źródło ---
            doc.setFontSize(10);
            doc.setFont(undefined, "italic");
            doc.text(`Źródło: https://yourdomain.com/recipes/${slug}`, 20, yPosition);

            doc.save(`${slug}.pdf`);
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Błąd podczas generowania PDF. Sprawdź konsolę.");
        }
    };

    return (
        <Tooltip title="Eksportuj do PDF" placement="top">
            <IconButton
                id="RecipePdfButton"
                onClick={handlePdfExport}
                sx={{
                    color: theme => theme.palette.surface.main,
                    "&:hover": {
                        color: theme => theme.palette.surface.light,
                        backgroundColor: theme => theme.palette.action.hover,
                        borderRadius: "50%",
                    },
                    ...styles.copyButton,
                }}
            >
                <PictureAsPdfIcon sx={{ fontSize: "48px" }} />
            </IconButton>
        </Tooltip>
    );
}
