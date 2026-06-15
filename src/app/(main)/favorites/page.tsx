import PageTitle from "@/components/PageTitle";
import FavoritesClient from "./FavoritesClient";
import { getUserFavorites } from "@/utils";
import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const user = await getUserIdFromCookies();
    const initialRecipes = await getUserFavorites(user!);

    return (
        <>
            <PageTitle title="Ulubione przepisy" />

            <FavoritesClient initialRecipes={initialRecipes} />
        </>
    );
}
