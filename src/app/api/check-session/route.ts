import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const ALLOWED_ADMIN_EMAILS = [process.env.MY_EMAIL] as string[];

const oauth2Client = new google.auth.OAuth2();

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (typeof idToken !== "string") {
            return NextResponse.json(
                {
                    error: "Invalid idToken",
                    isAdminLogged: false,
                    loginStatus: "not_logged",
                },
                { status: 400 }
            );
        }

        const ticket = await oauth2Client.verifyIdToken({
            idToken,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        });

        const payload = ticket.getPayload();

        if (!payload?.email || !payload.email_verified) {
            return NextResponse.json(
                {
                    error: "Email missing or not verified",
                    isAdminLogged: false,
                    loginStatus: "not_logged",
                },
                { status: 401 }
            );
        }

        const email = payload.email.toLowerCase();
        const isAdminLogged = ALLOWED_ADMIN_EMAILS.includes(email);
        const loginStatus = isAdminLogged ? "admin" : "user";

        // ✅ Set cookie using NextResponse.cookies
        const response = NextResponse.json({
            isAdminLogged,
            loginStatus,
        });

        response.cookies.set("session", idToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;
    } catch (error) {
        const err = error as Error;
        console.error("[check-session] Failed:", err.message);
        return NextResponse.json(
            {
                error: "Token verification failed",
                isAdminLogged: false,
                loginStatus: "not_logged",
            },
            { status: 401 }
        );
    }
}
