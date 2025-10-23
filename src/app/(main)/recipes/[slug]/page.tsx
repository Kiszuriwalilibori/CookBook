import { notFound } from "next/navigation";
import { getRecipeBySlug } from "@/lib/sanity";
import { Recipe } from "@/lib/types";
import { Box } from "@mui/material";
import { Separator } from "@/components";
import { RecipeHero, RecipeMetadata, RecipeDescription, RecipeIngredients, RecipePreparationSteps, RecipeSource, RecipeCopyButton, RecipePrintButton, RecipePdfButton } from "./parts";
import { styles } from "./styles";

interface Params {
    slug: string;
}

export default async function RecipePage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const recipe: Recipe | null = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound(); // 404 if no recipe
    }

    const isAdmin = false;

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
            {isAdmin && <RecipeSource recipe={recipe} />}
            <Separator />
            <Box sx={styles.copyButtonContainer}>
                <RecipeCopyButton recipe={recipe} slug={slug} />
                <RecipePrintButton />
                <RecipePdfButton recipe={recipe} slug={slug} />
            </Box>
        </Box>
    );
}
