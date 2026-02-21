import { cookies } from "next/headers";
import { verifyGoogle } from "@/utils";
import type { User } from "@/types";

export async function getUserFromCookies(): Promise<(User & { isAdmin: boolean }) | null> {
    try {
        const cookieStore = await cookies(); // <-- dodaj await!
        const token = cookieStore.get("session")?.value;
        if (!token) return null;

        const user = await verifyGoogle(token);
        if (!user?.userId) return null;

        const isAdmin = process.env.MY_EMAIL ? user.email.toLowerCase() === process.env.MY_EMAIL.toLowerCase() : false;
        return { ...user, isAdmin };
        // return user;
    } catch (err) {
        console.error("[getUserFromCookies] Error:", err);
        return null;
    }
}
