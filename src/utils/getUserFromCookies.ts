import { cookies } from "next/headers";
import { verifyGoogle } from "@/utils";
import type { User } from "@/types";

export async function getUserFromCookies(): Promise<User | null> {
    try {
        const cookieStore = await cookies(); // <-- dodaj await!
        const token = cookieStore.get("session")?.value;
        if (!token) return null;

        const user = await verifyGoogle(token);
        if (!user?.userId) return null;

        return user;
    } catch (err) {
        console.error("[getUserFromCookies] Error:", err);
        return null;
    }
}
