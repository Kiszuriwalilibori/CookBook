import type { Recipe } from "@/types";

import { RecipeCardContainer } from "./RecipeCard.Container";

interface RecipeCardProps {
    recipe: Recipe;
    onRemoved?: (recipeId: string) => void;
}

export function RecipeCard({ recipe, onRemoved }: RecipeCardProps) {
    return <RecipeCardContainer recipe={recipe} onRemoved={onRemoved} />;
}

export default RecipeCard;
