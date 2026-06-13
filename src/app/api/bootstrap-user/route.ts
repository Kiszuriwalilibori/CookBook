import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function GET() {
    const cookieStore = await cookies();

    let userId = cookieStore.get("userId")?.value;

    if (!userId) {
        userId = randomUUID();

        cookieStore.set("userId", userId, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });
    }

    return Response.json({ userId });
}
