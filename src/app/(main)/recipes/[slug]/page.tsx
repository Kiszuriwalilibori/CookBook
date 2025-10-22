import { notFound } from "next/navigation";
import { getRecipeBySlug } from "@/lib/sanity";
import { Recipe } from "@/lib/types";
import { Box } from "@mui/material";
import { Separator } from "@/components";
import { RecipeHero } from "./parts/RecipeHero";
import { RecipeMetadata } from "./parts/RecipeMetadata";
import { RecipeDescription } from "./parts/RecipeDescription";
import { RecipeIngredients } from "./parts/RecipeIngredients";
import { RecipePreparationSteps } from "./parts/RecipePreparationSteps";
import { RecipeSource } from "./parts/RecipeSource";
import { RecipeCopyButton } from "./parts/RecipeCopyButton";
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
        <Box sx={styles.root}>
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
            </Box>
        </Box>
    );
}
