import { jwtVerify, createRemoteJWKSet } from "jose";
import type { NextRequest } from "next/server";

const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export async function verifyGoogle(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (!auth) throw new Error("No auth");

    const token = auth.replace("Bearer ", "");

    const { payload } = await jwtVerify(token, JWKS, {
        issuer: ["https://accounts.google.com", "accounts.google.com"],
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    return {
        userId: payload.sub as string,
        email: payload.email as string | undefined,
        name: payload.name as string | undefined,
    };
}
