"use client";

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { PortableText } from "@portabletext/react";

import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Recipe } from "@/types";
import { styles } from "../styles";
import { RecipePreparationProgressBar } from "./RecipePreparationProgressBar";
import { PortableContentComponents } from "./PortableContentComponents";
import { useRecipePreparationProgress } from "./useRecipePreparationProgress";

interface RecipePreparationStepsProps {
    recipe: Recipe;
}

export function RecipePreparationSteps({ recipe }: RecipePreparationStepsProps) {
    const preparationSteps = recipe.preparationSteps ?? [];

    const { activeStep, stepRefs } = useRecipePreparationProgress(preparationSteps.length);
    if (preparationSteps.length === 0) {
        return null;
    }

    const totalSteps = preparationSteps.length;

    return (
        <Box id="RecipePreparationSteps" sx={styles.preparationContainer}>
            <RecipePreparationProgressBar activeStep={activeStep} totalSteps={totalSteps} />
            <Typography variant="h2" sx={styles.preparationTitle}>
                Przygotowanie
            </Typography>

            {preparationSteps.map((step, i) => (
                <Box
                    key={step._key || i}
                    ref={(element: HTMLDivElement | null) => {
                        stepRefs.current[i] = element;
                    }}
                    data-step-index={i}
                >
                    <Accordion id={`RecipePreparationStep-${i + 1}`} defaultExpanded sx={styles.recipeStepAccordion}>
                        <AccordionSummary expandIcon={null} sx={styles.recipeStepAccordionSummary} aria-label={`Krok ${i + 1} — szczegóły przygotowania`}>
                            <Typography variant="h3" sx={styles.recipeStepIndex}>
                                {i + 1}
                            </Typography>

                            <ExpandMoreIcon sx={styles.recipeStepExpandIcon} aria-hidden="true" />
                        </AccordionSummary>

                        <AccordionDetails sx={styles.recipeStepAccordionDetails}>
                            {step.image?.asset?.url && (
                                <Box sx={styles.stepImageContainer}>
                                    <Image src={step.image.asset.url} alt={step.image.alt || `Zdjęcie do kroku ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
                                </Box>
                            )}

                            {step.content && <PortableText value={step.content} components={PortableContentComponents} />}

                            {step.notes && (
                                <Typography variant="body2" sx={styles.stepNotes}>
                                    {step.notes}
                                </Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            ))}
        </Box>
    );
}
