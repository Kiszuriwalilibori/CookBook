import { Box } from "@mui/material";
import { notFound, redirect } from "next/navigation";
import { getInitialRecipeComments } from "@/utils/getInitialRecipeComments";
import ShowSnackbar from "@/components/ShowSnackBar";

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

import { styles } from "./styles";
import { mapRecipeToMetadata } from "./parts/RecipeMetadata/RecipeMetadata.utils";

import { generateRecipeMetadata, generateRecipeSchema, getRecipeById, getUserRecipeNote, resolveRecipeIdFromSlug } from "@/utils";

import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";
import { RecipeIngredientsClearButton } from "./parts/RecipeIngredientsClearButton";
import { ApiErrorPayload } from "@/models/apiResponse";
import PrivateRecipeNotes from "./parts/Comments/PrivateRecipeNotes";

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

    let recipeNotes: string | undefined;
    let recipeNotesLoadError: ApiErrorPayload | null = null;

    if (userId) {
        try {
            recipeNotes = await getUserRecipeNote(userId, recipe._id);
        } catch (error) {
            console.error("Error loading private recipe notes:", error);

            recipeNotesLoadError = {
                code: "USER_NOTES_FETCH_FAILED",
                message: "Nie udało się pobrać Twoich prywatnych notatek. Spróbuj ponownie później.",
            };
        }
    }

    // 3️⃣ SEO canonical redirect
    const canonicalSlug = recipe.slug?.current;
    if (canonicalSlug && canonicalSlug !== slug) {
        redirect(`/recipes/${canonicalSlug}`);
    }
    // 4️⃣ initial comments
    const initialComments = await getInitialRecipeComments(recipe._id);
    // 4️ schema.org
    const jsonLd = generateRecipeSchema(recipe);
    const metadata = mapRecipeToMetadata(recipe);

    return (
        <>
            {recipeNotesLoadError && <ShowSnackbar error={recipeNotesLoadError} />}
            {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

            <Box id="RecipePage" sx={styles.root}>
                <RecipeHero recipe={recipe} />
                <RecipeMetadata metadata={metadata} />
                <Separator />
                <RecipeDescription recipe={recipe} />
                <Separator />
                <RecipeRatingSection recipeId={recipe._id} averageRating={recipe.ratingSummary?.average ?? null} totalRatings={recipe.ratingSummary?.count ?? 0} />
                <Separator />
                <Box component="section" id="Ingredients prep wrapper" sx={styles.ingredientsPrepWrapper}>
                    <Box component="section" sx={styles.ingredientsWrapper}>
                        <RecipeIngredientsGeneric recipe={recipe} id="RecipeIngredients" title="Składniki" ingredients={recipe.ingredients} />
                        <RecipeIngredientsGeneric recipe={recipe} id="RecipeOptionalIngredients" title="Składniki opcjonalne" ingredients={recipe.optionalIngredients} />
                        <RecipeIngredientsClearButton recipeId={recipe._id} />
                        <RecipeIngredientsNotes recipe={recipe} />
                    </Box>

                    <Box component="section" sx={styles.preparationSectionWrapper}>
                        <RecipePreparationSteps recipe={recipe} />
                        <RecipeNutrition nutrition={recipe.nutrition} />
                    </Box>
                </Box>

                <RecipeSource recipe={recipe} />

                <Separator />
                {userId && recipeNotes?.trim() && <PrivateRecipeNotes recipeNotes={recipeNotes} />}
                <Box sx={styles.copyButtonContainer}>
                    <RecipeCopyButton recipe={recipe} />
                    <RecipePrintButton />
                    <RecipePdfButton recipe={recipe} slug={slug} />
                    <RecipeKeepAwakeButton />
                    <RecipeShareButton title={recipe.title} />
                    <RecipeNotesButton recipeId={recipe._id} initialNotes={recipeNotes} />
                    <RecipeCommentsButton />
                </Box>
                <Separator />
                <Comments recipeId={recipe._id} initialComments={initialComments.comments} totalComments={initialComments.totalComments} totalThreads={initialComments.totalThreads} />
                {/* <Comments recipeId={recipe._id} /> */}
            </Box>
        </>
    );
}
