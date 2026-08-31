import { NextRequest, NextResponse } from "next/server";

import { google } from "googleapis";

import { ApiError, ApiSuccessResponse, apiErrorResponse, parseBody } from "@/models/apiResponse";

const ALLOWED_ADMIN_EMAILS = [process.env.MY_EMAIL] as string[];

const oauth2Client = new google.auth.OAuth2();

type CheckSessionData = {
    isAdminLogged: boolean;
    loginStatus: "admin" | "user";
};

type CheckSessionRequest = {
    idToken?: string;
};

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await parseBody<CheckSessionRequest>(request);

        if (typeof idToken !== "string") {
            throw new ApiError("INVALID_ID_TOKEN", "Nieprawidłowy idToken", 400);
        }

        const ticket = await oauth2Client.verifyIdToken({
            idToken,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        });

        const payload = ticket.getPayload();

        if (!payload?.email || !payload.email_verified) {
            throw new ApiError("EMAIL_NOT_VERIFIED", "Email missing or not verified", 401);
        }

        const email = payload.email.toLowerCase();
        const isAdminLogged = ALLOWED_ADMIN_EMAILS.includes(email);
        const loginStatus = isAdminLogged ? "admin" : "user";

        const response = NextResponse.json<ApiSuccessResponse<CheckSessionData>>({
            ok: true,
            data: {
                isAdminLogged,
                loginStatus,
            },
        });

        response.cookies.set("session", idToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;
    } catch (err: unknown) {
        console.error("[check-session] Failed:", err);
        return apiErrorResponse(err);
    }
}
// todo rozważyć przejście na schema validation bo nie ma innego spozobu, żeby  nie powtarzać
// if (typeof idToken !== "string") {
//     throw new ApiError("INVALID_ID_TOKEN", "Nieprawidłowy idToken", 400);
// }
// stringa w tym miejscu

// Jeśli chcesz naprawdę jedno źródło prawdy

// Wtedy potrzebujesz schematu runtime, np. Zod:

// const CheckSessionRequestSchema = z.object({
//     idToken: z.string(),
// });

// i z niego możesz uzyskać typ:

// type CheckSessionRequest = z.infer<typeof CheckSessionRequestSchema>;

// Wtedy schemat jest rzeczywiście jednym źródłem prawdy dla struktury danych.

// Ale to jest większy refaktor i przy tym, co teraz robimy z parseBody, nie wprowadzałbym Zoda tylko dla tego jednego endpointu.
