"use client";

import { Box, LinearProgress, Typography } from "@mui/material";

import { styles } from "./RecipePreparationProgressBar.styles";

interface RecipePreparationProgressBarProps {
    activeStep: number;
    totalSteps: number;
}

export function RecipePreparationProgressBar({ activeStep, totalSteps }: RecipePreparationProgressBarProps) {
    const progress = ((activeStep + 1) / totalSteps) * 100;

    return (
        <Box sx={styles.preparationProgressBar} id="progress-bar">
            <Typography variant="body1" component="span" sx={styles.preparationProgressLabel}>
                Krok {activeStep + 1} / {totalSteps}
            </Typography>

            <LinearProgress variant="determinate" value={progress} aria-label={`Postęp przygotowania: krok ${activeStep + 1} z ${totalSteps}`} sx={styles.preparationProgress} id="linear-progress" />
        </Box>
    );
}
