// "use client";

// import RecipeRatingWidget from "./RecipeRatingWidget/RecipeRatingWidget";

// interface RecipeRatingSectionProps {
//     recipeId: string;
//     averageRating: number | null;
//     totalRatings: number;
// }

// export function RecipeRatingSection({ recipeId, averageRating, totalRatings }: RecipeRatingSectionProps) {
//     return <RecipeRatingWidget recipeId={recipeId} averageRating={averageRating} totalRatings={totalRatings} />;
// }

// export default RecipeRatingSection;

"use client";

import { useState } from "react";
import RecipeRatingWidget from "./RecipeRatingWidget/RecipeRatingWidget";
import type { ApiResponse } from "@/models/apiResponse";
import type { RatingSummary } from "@/types/recipeRatings";

interface RecipeRatingSectionProps {
    recipeId: string;
    averageRating: number | null;
    totalRatings: number;
}

export function RecipeRatingSection({ recipeId, averageRating, totalRatings }: RecipeRatingSectionProps) {
    const [avg, setAvg] = useState(averageRating);
    const [count, setCount] = useState(totalRatings);

    const fetchRatings = async () => {
        const res = await fetch(`/api/recipe-ratings?recipeId=${recipeId}`);
        const data: ApiResponse<RatingSummary> = await res.json();
        if (!data.ok) {
            console.error(data.error);
            return;
        }

        setAvg(data.data.average);
        setCount(data.data.count);
    };

    return <RecipeRatingWidget recipeId={recipeId} averageRating={avg} totalRatings={count} onRatingUpdated={fetchRatings} />;
}

export default RecipeRatingSection;
//todo: data.data żle wygląda
// todo guzik do zmieniania oceny w widżecie fatalnie wygląda
