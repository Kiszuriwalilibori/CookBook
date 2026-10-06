import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function createSessionToken({ userId, email }: { userId: string; email: string }) {
    return new SignJWT({ userId, email }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setIssuedAt().setExpirationTime("7d").sign(secret);
}

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
