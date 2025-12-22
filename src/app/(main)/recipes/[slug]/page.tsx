import { Box } from "@mui/material";
import { notFound } from "next/navigation";

import { Recipe } from "@/types";
import { Separator } from "@/components";
import { getRecipeBySlug } from "@/utils";
import { styles } from "./styles";
import { RecipeHero, RecipeMetadata, RecipeDescription, RecipeIngredients, RecipePreparationSteps, RecipeSource, RecipeCopyButton, RecipePrintButton, RecipePdfButton, RecipeKeepAwakeButton } from "./parts";
import { generateRecipeMetadata } from "@/utils/generateRecipeMetadata";
import { generateRecipeSchema } from "@/utils/schema-org";

interface Params {
    slug: string;
}
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        return { title: "Nie znaleziono przepisu" };
    }

    return generateRecipeMetadata(recipe);
}

export default async function RecipePage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const recipe: Recipe | null = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound(); // 404 if no recipe
    }
    const jsonLd = generateRecipeSchema(recipe);
    return (
        <>
            {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
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
                    <RecipeCopyButton recipe={recipe} />
                    <RecipePrintButton />
                    <RecipePdfButton recipe={recipe} slug={slug} />
                    <RecipeKeepAwakeButton />
                </Box>
            </Box>
        </>
    );
}

// Add fallback audio Loop
// server side generating
// screen orientation lock
