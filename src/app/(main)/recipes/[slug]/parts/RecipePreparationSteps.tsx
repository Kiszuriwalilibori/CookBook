"use client";

import { useEffect, useRef, useState } from "react";

import { Accordion, AccordionDetails, AccordionSummary, Box, LinearProgress, Typography } from "@mui/material";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Recipe } from "@/types";
import { styles, portableTextSx } from "../styles";

// Custom PortableText components
const PortableTextComponents: Partial<PortableTextComponents> = {
    block: ({ children }) => (
        <Typography variant="body1" sx={portableTextSx.block}>
            {children}
        </Typography>
    ),
    list: ({ children }) => (
        <Box component="ul" sx={portableTextSx.list}>
            {children}
        </Box>
    ),
    listItem: ({ children }) => (
        <Box component="li" sx={portableTextSx.listItem}>
            {children}
        </Box>
    ),
    marks: {
        strong: ({ children }) => (
            <Typography component="strong" sx={portableTextSx.strong}>
                {children}
            </Typography>
        ),
        em: ({ children }) => (
            <Typography component="em" sx={portableTextSx.em}>
                {children}
            </Typography>
        ),
        link: ({ children, value }) => (
            <Typography component="a" href={value?.href || "#"} target="_blank" rel="noopener noreferrer" sx={portableTextSx.link}>
                {children}
            </Typography>
        ),
    },
};

interface RecipePreparationStepsProps {
    recipe: Recipe;
}

export function RecipePreparationSteps({ recipe }: RecipePreparationStepsProps) {
    const preparationSteps = recipe.preparationSteps ?? [];
    const [activeStep, setActiveStep] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const steps = stepRefs.current.filter((step): step is HTMLDivElement => step !== null);

        if (steps.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                const visibleSteps = entries
                    .filter(entry => entry.isIntersecting)
                    .map(entry => ({
                        index: Number(entry.target.getAttribute("data-step-index")),
                        top: entry.boundingClientRect.top,
                    }));

                if (visibleSteps.length === 0) {
                    return;
                }

                const closestStep = visibleSteps.reduce((closest, current) => (Math.abs(current.top) < Math.abs(closest.top) ? current : closest));

                setActiveStep(closestStep.index);
            },
            {
                rootMargin: "-96px 0px -60% 0px",
                threshold: 0,
            }
        );

        steps.forEach(step => observer.observe(step));

        return () => observer.disconnect();
    }, [preparationSteps.length]);

    if (preparationSteps.length === 0) {
        return null;
    }

    const totalSteps = preparationSteps.length;
    const progress = ((activeStep + 1) / totalSteps) * 100;

    return (
        <Box id="RecipePreparationSteps" sx={styles.preparationContainer}>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    px: 2,
                    mb: 2,
                    backgroundColor: "background.paper",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="body1"
                    component="span"
                    sx={{
                        flexShrink: 0,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    Krok {activeStep + 1} / {totalSteps}
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={progress}
                    aria-label={`Postęp przygotowania: krok ${activeStep + 1} z ${totalSteps}`}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                    }}
                />
            </Box>

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
                        <AccordionSummary expandIcon={null} sx={styles.recipeStepAccordionSummary}>
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

                            {step.content && <PortableText value={step.content} components={PortableTextComponents} />}

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
