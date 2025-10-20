// app/recipes/[slug]/page.tsx
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
            <Separator /> {/* 1st: After hero/title, matching original */}
            <RecipeMetadata recipe={recipe} />
            <RecipeDescription recipe={recipe} />
            <Separator /> {/* 2nd: After description, matching original post-description */}
            <RecipeIngredients recipe={recipe} />
            <Separator /> {/* 3rd: After ingredients, matching original flow to preparation */}
            <RecipePreparationSteps recipe={recipe} />
            {isAdmin && <RecipeSource recipe={recipe} />}
        </Box>
    );
}
