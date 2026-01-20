import PageTitle from "@/components/PageTitle";
import { getFavoriteRecipesForSSR } from "@/utils/getFavoriteRecipesForSSR";
import FavoritesClient from "./FavoritesClient";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const initialRecipes = await getFavoriteRecipesForSSR();

    return (
        <>
            <PageTitle title="Ulubione przepisy" />
            <FavoritesClient initialRecipes={initialRecipes} />
        </>
    );
}
