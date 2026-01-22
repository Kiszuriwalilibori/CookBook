// utils/googleAuth.ts
import { User } from "@/types";
import { google } from "googleapis";
import { NextRequest } from "next/server";

// Accept either a NextRequest (from API route) OR a token string
export async function verifyGoogle(input: NextRequest | string): Promise<User> {
    let token: string | undefined;

    if (typeof input === "string") {
        token = input;
    } else {
        token = input.cookies.get("session")?.value;
    }

    if (!token) throw new Error("Unauthorized: No token");

    const oauth2Client = new google.auth.OAuth2();

    const ticket = await oauth2Client.verifyIdToken({
        idToken: token,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
        throw new Error("Unauthorized: Email missing or not verified");
    }

    return {
        userId: payload.sub!, // Google user ID
        email: payload.email,
    };
}
