import { redirect } from "next/navigation";

import PageTitle from "@/components/PageTitle";
import FavoritesClient from "./FavoritesClient";
import { getUserFavorites } from "@/utils";
import { getUserFromCookies } from "@/utils/server/getUserFromCookies";
import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const user = await getUserFromCookies();
    const cookies = await getUserIdFromCookies();
    console.log("cokies", cookies);
    if (!user) redirect("/");

    const initialRecipes = await getUserFavorites(user.userId);

    return (
        <>
            <PageTitle title="Ulubione przepisy" />
            <FavoritesClient initialRecipes={initialRecipes} />
        </>
    );
}
