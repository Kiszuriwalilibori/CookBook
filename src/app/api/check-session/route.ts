// src/app/api/check-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const ALLOWED_ADMIN_EMAILS = [process.env.MY_EMAIL] as string[];

const oauth2Client = new google.auth.OAuth2();

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (typeof idToken !== "string") {
            return NextResponse.json({ error: "Invalid idToken" }, { status: 400 });
        }

        const ticket = await oauth2Client.verifyIdToken({
            idToken,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        });

        const payload = ticket.getPayload();

        // Early return jeśli brak emaila lub nie zweryfikowany
        if (!payload?.email || !payload.email_verified) {
            return NextResponse.json({ error: "Email missing or not verified" }, { status: 401 });
        }

        // Tutaj TS już wie, że email istnieje → bezpieczne użycie
        const email = payload.email.toLowerCase();
        const isAdminLogged = ALLOWED_ADMIN_EMAILS.includes(email);

        return NextResponse.json({ isAdminLogged });
    } catch (error) {
        const err = error as Error;
        console.error("[check-session] Failed:", err.message);
        return NextResponse.json({ error: "Token verification failed" }, { status: 401 });
    }
}
