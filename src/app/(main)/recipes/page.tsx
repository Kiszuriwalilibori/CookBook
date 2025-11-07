import { getRecipesForCards } from "@/lib/getRecipesForCards";
import RecipesClient from "./RecipesClient";

export const revalidate = 3600;

export default async function RecipesPage() {
    const initialRecipes = await getRecipesForCards();
    return <RecipesClient initialRecipes={initialRecipes} />;
}
