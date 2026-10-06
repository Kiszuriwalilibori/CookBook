import { getSessionUser } from "../session";
import type { User } from "@/types";

export async function getUserFromCookies(): Promise<(User & { isAdmin: boolean }) | null> {
    try {
        const user = await getSessionUser();
        if (!user?.userId) return null;

        const isAdmin = process.env.MY_EMAIL ? user.email.toLowerCase() === process.env.MY_EMAIL.toLowerCase() : false;
        return { ...user, isAdmin };
    } catch (err) {
        console.error("[getUserFromCookies] Error:", err);
        return null;
    }
}
