// app/recipes/[slug]/parts/RecipePreparationSteps.tsx
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Recipe } from "@/types";
import { styles, portableTextSx} from "../styles";

// Custom PortableText components (typed correctly for compatibility)
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
    if (!recipe.preparationSteps || recipe.preparationSteps.length === 0) {
        return null;
    }

    return (
        <Box id="RecipePreparationSteps" sx={styles.preparationContainer}>
            <Typography variant="h2" sx={styles.preparationTitle}>
                Przygotowanie
            </Typography>
            {recipe.preparationSteps.map((step, i) => (
                <Accordion
                    id={`RecipePreparationStep-${i + 1}`}
                    key={step._key || i}
                    defaultExpanded={true} // Initially expanded
                    sx={styles.recipeStepAccordion}
                >
                    <AccordionSummary
                        expandIcon={null} // Hide default icon
                        sx={styles.recipeStepAccordionSummary}
                    >
                        <Typography variant="h3" sx={styles.recipeStepIndex}>
                            {i + 1}
                        </Typography>
                        <ExpandMoreIcon sx={styles.recipeStepExpandIcon} />
                    </AccordionSummary>
                    <AccordionDetails sx={styles.recipeStepAccordionDetails}>
                        {" "}
                        {/* Negative margin to reduce gap between summary and details */}
                        {step.image?.asset?.url && (
                            <Box sx={styles.stepImageContainer}>
                                <Image src={step.image.asset.url!} alt={step.image.alt || `Step ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
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
            ))}
        </Box>
    );
}
