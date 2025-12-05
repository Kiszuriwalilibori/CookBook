import { Box } from "@mui/material";
import { notFound } from "next/navigation";

import { Recipe } from "@/types";
import { Separator } from "@/components";
import { getRecipeBySlug } from "@/utils";
import { styles } from "./styles";
import { RecipeHero, RecipeMetadata, RecipeDescription, RecipeIngredients, RecipePreparationSteps, RecipeSource, RecipeCopyButton, RecipePrintButton, RecipePdfButton, RecipeKeepAwakeButton } from "./parts";

interface Params {
    slug: string;
}
export const revalidate = 3600;

export default async function RecipePage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const recipe: Recipe | null = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound(); // 404 if no recipe
    }

    return (
        <Box id="RecipePage" sx={styles.root}>
            <RecipeHero recipe={recipe} />
            <RecipeMetadata recipe={recipe} />
            <RecipeDescription recipe={recipe} />
            <Separator />
            <Box sx={styles.ingredientsPrepWrapper}>
                <Box sx={styles.ingredientsWrapper}>
                    <RecipeIngredients recipe={recipe} />
                </Box>
                <Box sx={styles.prepWrapper}>
                    <RecipePreparationSteps recipe={recipe} />
                </Box>
            </Box>
            <RecipeSource recipe={recipe} />
            <Separator />
            <Box sx={styles.copyButtonContainer}>
                <RecipeCopyButton recipe={recipe} slug={slug} />
                <RecipePrintButton />
                <RecipePdfButton recipe={recipe} slug={slug} />
                <RecipeKeepAwakeButton />
            </Box>
        </Box>
    );
}

// Add fallback audio Loop
// server side generating
// screen orientation lock
