"use client";

import RecipeRatingWidget from "./RecipeRatingWidget";

interface RecipeRatingSectionProps {
    recipeId: string;
    averageRating: number | null;
    totalRatings: number;
}

export function RecipeRatingSection({ recipeId, averageRating, totalRatings }: RecipeRatingSectionProps) {
    return <RecipeRatingWidget recipeId={recipeId} averageRating={averageRating} totalRatings={totalRatings} raterName="Anonimowy" />;
}

export default RecipeRatingSection;
