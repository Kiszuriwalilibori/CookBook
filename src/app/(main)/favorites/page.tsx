

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PageTitle from "@/components/PageTitle";
import FavoritesClient from "./FavoritesClient";
import { getFavoriteRecipesForSSR } from "@/utils/getFavoriteRecipesForSSR";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const cookieStore = await cookies();

    if (!cookieStore.has("session")) {
        redirect("/");
    }

    const initialRecipes = await getFavoriteRecipesForSSR();

    return (
        <>
            <PageTitle title="Ulubione przepisy" />
            <FavoritesClient initialRecipes={initialRecipes} />
        </>
    );
}
