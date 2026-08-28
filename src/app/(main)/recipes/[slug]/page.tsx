import { Box } from "@mui/material";
import { notFound, redirect } from "next/navigation";

import { Separator } from "@/components";

import {
    RecipeCommentsButton,
    RecipeCopyButton,
    RecipeDescription,
    RecipeHero,
    RecipeIngredientsGeneric,
    RecipeIngredientsNotes,
    RecipeKeepAwakeButton,
    RecipeMetadata,
    RecipeNotesButton,
    RecipeNutrition,
    RecipePdfButton,
    RecipePreparationSteps,
    RecipePrintButton,
    RecipeRatingSection,
    RecipeShareButton,
    RecipeSource,
} from "./parts";

import Comments from "./parts/Comments";
import PrivateUserNotes from "./parts/Comments/PrivateUserNotes";

import { styles } from "./styles";
import { mapRecipeToMetadata } from "./parts/RecipeMetadata/RecipeMetadata.utils";

import { generateRecipeMetadata, generateRecipeSchema, getRecipeById, getUserRecipeNote, resolveRecipeIdFromSlug } from "@/utils";

import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";
import { RecipeIngredientsClearButton } from "./parts/RecipeIngredientsClearButton";

interface Params {
    slug: string;
}

export const dynamic = "force-dynamic";

//
// ─────────────────────────────────────────────────────────────
// Metadata (SEO)
// ─────────────────────────────────────────────────────────────
//
export async function generateMetadata({ params }: { params: Promise<Params> }) {
    const { slug } = await params;

    const id = await resolveRecipeIdFromSlug(slug);
    if (!id) {
        return { title: "Nie znaleziono przepisu" };
    }

    const recipe = await getRecipeById(id);
    if (!recipe) {
        return { title: "Nie znaleziono przepisu" };
    }

    return generateRecipeMetadata(recipe);
}

//
// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
//
export default async function RecipePage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;

    // 1️⃣ slug → _id
    const id = await resolveRecipeIdFromSlug(slug);
    if (!id) notFound();

    // 2️⃣ _id → recipe

    const [recipe, userId] = await Promise.all([getRecipeById(id), getUserIdFromCookies()]);
    if (!recipe) notFound();
    let initialNotes: string | undefined = undefined;
    if (userId) {
        initialNotes = await getUserRecipeNote(userId, recipe._id);
    }

    // 3️⃣ SEO canonical redirect
    const canonicalSlug = recipe.slug?.current;
    if (canonicalSlug && canonicalSlug !== slug) {
        redirect(`/recipes/${canonicalSlug}`);
    }

    // 4️⃣ schema.org
    const jsonLd = generateRecipeSchema(recipe);
    const metadata = mapRecipeToMetadata(recipe);

    return (
        <>
            {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

            <Box id="RecipePage" sx={styles.root}>
                <RecipeHero recipe={recipe} />
                <RecipeMetadata metadata={metadata} />
                <RecipeDescription recipe={recipe} />

                <Separator />
                <RecipeRatingSection recipeId={recipe._id} averageRating={recipe.ratingSummary?.average ?? null} totalRatings={recipe.ratingSummary?.count ?? 0} />
                <Separator />
                <Box sx={styles.ingredientsPrepWrapper}>
                    <Box sx={styles.ingredientsWrapper}>
                        <RecipeIngredientsGeneric recipe={recipe} id="RecipeIngredients" title="Składniki" ingredients={recipe.ingredients} />
                        <RecipeIngredientsGeneric recipe={recipe} id="RecipeOptionalIngredients" title="Składniki opcjonalne" ingredients={recipe.optionalIngredients} />
                        <RecipeIngredientsClearButton recipeId={recipe._id} />
                        <RecipeIngredientsNotes recipe={recipe} />
                    </Box>

                    <Box sx={styles.prepWrapper}>
                        <RecipePreparationSteps recipe={recipe} />
                        <RecipeNutrition nutrition={recipe.nutrition} />
                    </Box>
                </Box>

                <RecipeSource recipe={recipe} />

                <Separator />
                <PrivateUserNotes recipeId={recipe._id} initialNotes={initialNotes} />
                <Box sx={styles.copyButtonContainer}>
                    <RecipeCopyButton recipe={recipe} />
                    <RecipePrintButton />
                    <RecipePdfButton recipe={recipe} slug={slug} />
                    <RecipeKeepAwakeButton />
                    <RecipeShareButton title={recipe.title} />
                    <RecipeNotesButton recipeId={recipe._id} initialNotes={initialNotes} />
                    <RecipeCommentsButton />
                </Box>
                <Separator />
                <Comments recipeId={recipe._id} />
            </Box>
        </>
    );
}
