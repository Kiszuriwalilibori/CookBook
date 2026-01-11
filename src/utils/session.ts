// src/utils/session.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function getSessionUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        throw new Error("No session");
    }

    const { payload } = await jwtVerify(token, secret);

    return {
        userId: payload.userId as string,
        email: payload.email as string,
    };
}
