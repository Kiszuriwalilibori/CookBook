import { cookies } from "next/headers";

export async function getUserIdFromCookies() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) return null;

    return {
        userId,
        isAdmin: false, // na razie ignorujemy admin logikę
    };
}
