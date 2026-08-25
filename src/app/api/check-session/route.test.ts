/**
 * @jest-environment node
 */

process.env.MY_EMAIL = "admin@example.com";
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client-id.apps.googleusercontent.com";

import { NextRequest } from "next/server";

// ─────────────────────────────────────────────
// Mock googleapis
// ─────────────────────────────────────────────

jest.mock("googleapis", () => {
    const mockVerifyIdToken = jest.fn();

    return {
        google: {
            auth: {
                OAuth2: jest.fn().mockImplementation(() => ({
                    verifyIdToken: mockVerifyIdToken,
                })),
            },
        },
        __mockVerifyIdToken: mockVerifyIdToken,
    };
});

const { __mockVerifyIdToken: mockVerifyIdToken } = jest.requireMock("googleapis") as {
    __mockVerifyIdToken: jest.Mock;
};

// ─────────────────────────────────────────────
// Route jest ładowany dynamicznie.
//
// Ważne:
// MY_EMAIL musi być ustawione przed importem route.ts,
// ponieważ route.ts tworzy ALLOWED_ADMIN_EMAILS
// podczas inicjalizacji modułu.
// ─────────────────────────────────────────────

let POST: typeof import("@/app/api/check-session/route").POST;

beforeAll(async () => {
    const route = await import("@/app/api/check-session/route");

    POST = route.POST;
});

describe("POST /api/check-session", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    function createRequest(body: unknown) {
        return new NextRequest("http://localhost/api/check-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }

    // ─────────────────────────────────────────────
    // 1. Zwykły użytkownik
    // ─────────────────────────────────────────────

    it('zwraca ok: true z loginStatus: "user" dla zwykłego użytkownika', async () => {
        mockVerifyIdToken.mockResolvedValue({
            getPayload: () => ({
                email: "user@example.com",
                email_verified: true,
            }),
        });

        const res = await POST(createRequest({ idToken: "valid-user-token" }));

        const json = await res.json();

        expect(res.status).toBe(200);

        expect(json).toEqual({
            ok: true,
            data: {
                isAdminLogged: false,
                loginStatus: "user",
            },
        });
    });

    // ─────────────────────────────────────────────
    // 2. Administrator
    // ─────────────────────────────────────────────

    it('zwraca ok: true z loginStatus: "admin" dla administratora', async () => {
        mockVerifyIdToken.mockResolvedValue({
            getPayload: () => ({
                email: "admin@example.com",
                email_verified: true,
            }),
        });

        const res = await POST(createRequest({ idToken: "valid-admin-token" }));

        const json = await res.json();

        expect(res.status).toBe(200);

        expect(json).toEqual({
            ok: true,
            data: {
                isAdminLogged: true,
                loginStatus: "admin",
            },
        });
    });

    // ─────────────────────────────────────────────
    // 3. Cookie session
    // ─────────────────────────────────────────────

    it("ustawia cookie session z właściwymi atrybutami po pomyślnym uwierzytelnieniu", async () => {
        const token = "valid-session-token-xyz";

        mockVerifyIdToken.mockResolvedValue({
            getPayload: () => ({
                email: "user@example.com",
                email_verified: true,
            }),
        });

        const res = await POST(createRequest({ idToken: token }));

        expect(res.status).toBe(200);

        const setCookie = res.headers.get("set-cookie");

        expect(setCookie).toBeTruthy();
        expect(setCookie).toContain(`session=${token}`);
        expect(setCookie).toMatch(/HttpOnly/i);
        expect(setCookie).toMatch(/Path=\//i);
        expect(setCookie).toMatch(/SameSite=Lax/i);
        expect(setCookie).toMatch(/Max-Age=604800/);
        expect(setCookie).not.toMatch(/;\s*Secure/i);
    });

    // ─────────────────────────────────────────────
    // 4. INVALID_ID_TOKEN – bez weryfikacji Google
    // ─────────────────────────────────────────────

    it("zwraca INVALID_ID_TOKEN i nie uruchamia weryfikacji Google przy nieprawidłowym idToken", async () => {
        const res = await POST(createRequest({ idToken: 12345 }));

        const json = await res.json();

        expect(res.status).toBe(400);

        expect(json).toEqual({
            ok: false,
            error: {
                code: "INVALID_ID_TOKEN",
                message: "Nieprawidłowy idToken",
            },
        });

        expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    it.each([{}, { idToken: null }, { idToken: undefined }, { idToken: true }, { idToken: {} }])("zwraca INVALID_ID_TOKEN gdy idToken nie jest stringiem (%p)", async body => {
        mockVerifyIdToken.mockClear();

        const res = await POST(createRequest(body));

        const json = await res.json();

        expect(res.status).toBe(400);

        expect(json).toEqual({
            ok: false,
            error: {
                code: "INVALID_ID_TOKEN",
                message: "Nieprawidłowy idToken",
            },
        });

        expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    // ─────────────────────────────────────────────
    // 5. EMAIL_NOT_VERIFIED – bez cookie
    // ─────────────────────────────────────────────

    it("zwraca EMAIL_NOT_VERIFIED i nie ustawia cookie sesji gdy email nie jest zweryfikowany", async () => {
        mockVerifyIdToken.mockResolvedValue({
            getPayload: () => ({
                email: "unverified@example.com",
                email_verified: false,
            }),
        });

        const res = await POST(createRequest({ idToken: "token-unverified" }));

        const json = await res.json();

        expect(res.status).toBe(401);

        expect(json).toEqual({
            ok: false,
            error: {
                code: "EMAIL_NOT_VERIFIED",
                message: "Email missing or not verified",
            },
        });

        expect(res.headers.get("set-cookie")).toBeNull();
    });

    it("zwraca EMAIL_NOT_VERIFIED gdy payload nie zawiera emaila", async () => {
        mockVerifyIdToken.mockResolvedValue({
            getPayload: () => ({
                email_verified: true,
            }),
        });

        const res = await POST(createRequest({ idToken: "token-no-email" }));

        const json = await res.json();

        expect(res.status).toBe(401);

        expect(json).toEqual({
            ok: false,
            error: {
                code: "EMAIL_NOT_VERIFIED",
                message: "Email missing or not verified",
            },
        });

        expect(res.headers.get("set-cookie")).toBeNull();
    });

    // ─────────────────────────────────────────────
    // 6. INTERNAL_SERVER_ERROR
    // ─────────────────────────────────────────────

    it("zwraca INTERNAL_SERVER_ERROR gdy weryfikacja Google rzuci błąd", async () => {
        mockVerifyIdToken.mockRejectedValue(new Error("Invalid token signature"));

        const res = await POST(createRequest({ idToken: "bad-token" }));

        const json = await res.json();

        expect(res.status).toBe(500);

        expect(json).toEqual({
            ok: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Wystąpił nieoczekiwany błąd serwera",
            },
        });

        expect(res.headers.get("set-cookie")).toBeNull();
    });
});
