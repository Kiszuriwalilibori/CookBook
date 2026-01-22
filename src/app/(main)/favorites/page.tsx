import { redirect } from "next/navigation";

import PageTitle from "@/components/PageTitle";
import FavoritesClient from "./FavoritesClient";
import { getUserFavorites, getUserFromCookies} from "@/utils";


export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const user = await getUserFromCookies();

    if (!user) redirect("/");

    const initialRecipes = await getUserFavorites(user.userId);

    return (
        <>
            <PageTitle title="Ulubione przepisy" />
            <FavoritesClient initialRecipes={initialRecipes} />
        </>
    );
}
