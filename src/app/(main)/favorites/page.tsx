import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PageTitle from "@/components/PageTitle";
import FavoritesClient from "./FavoritesClient";
import { verifyGoogle } from "@/utils";
import { getUserFavorites } from "@/utils/getUserFavorites";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
    const cookieStore = await cookies();

    const token = cookieStore.get("session")?.value;
    if (!token) redirect("/");

    const user = await verifyGoogle(token);
    if (!user?.userId) redirect("/");

    const initialRecipes = await getUserFavorites(user.userId);

    return (
        <>
            <PageTitle title="Ulubione przepisy" />
            <FavoritesClient initialRecipes={initialRecipes} />
        </>
    );
}
