import { cleanup, renderHook, waitFor } from "@testing-library/react";

import { useGoogleSignIn } from "./useGoogleSignIn";

import { useAdminStore } from "@/stores/useAdminStore";

// Skrypt Google Sign-In jest dodawany do dokumentu.
// Google Sign-In zostaje zainicjalizowany z właściwym Client ID i callbackiem.
// Przycisk logowania Google zostaje wyrenderowany z właściwymi ustawieniami.
// Flaga googleInitialized zostaje ustawiona po poprawnej inicjalizacji.
// Po pomyślnej odpowiedzi API status zalogowania użytkownika zostaje ustawiony.
// Żądanie do /api/check-session zawiera token Google i właściwe parametry.
// Po pomyślnej odpowiedzi API status administratora zostaje ustawiony.
// Błędna odpowiedź API powoduje ustawienie statusu not_logged.
// Błąd wykonania żądania powoduje ustawienie statusu not_logged.
// Ponowna inicjalizacja Google Sign-In nie następuje, jeśli został już zainicjalizowany.

jest.mock("@/stores/useAdminStore", () => ({
    useAdminStore: jest.fn(),
}));

const mockSetLoginStatus = jest.fn();
const mockInitialize = jest.fn();
const mockRenderButton = jest.fn();

const mockGoogle = {
    accounts: {
        id: {
            initialize: mockInitialize,
            renderButton: mockRenderButton,
        },
    },
};

const mockedUseAdminStore = useAdminStore as unknown as jest.MockedFunction<typeof useAdminStore>;

describe("useGoogleSignIn", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseAdminStore.mockReturnValue({
            setLoginStatus: mockSetLoginStatus,
        } as ReturnType<typeof useAdminStore>);

        delete (
            window as typeof window & {
                googleInitialized?: boolean;
            }
        ).googleInitialized;

        Object.defineProperty(window, "google", {
            configurable: true,
            writable: true,
            value: mockGoogle,
        });

        global.fetch = jest.fn();
    });

    afterEach(() => {
        cleanup();

        document.querySelectorAll('script[src="https://accounts.google.com/gsi/client"]').forEach(script => script.remove());

        document.querySelectorAll("#google-signin-button").forEach(container => container.remove());
    });

    it("initializes Google Sign-In and renders the button", async () => {
        const container = document.createElement("div");
        container.id = "google-signin-button";
        document.body.appendChild(container);

        renderHook(() => useGoogleSignIn());

        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

        expect(script).not.toBeNull();

        script?.dispatchEvent(new Event("load"));

        await waitFor(() => {
            expect(mockInitialize).toHaveBeenCalledTimes(1);
        });

        expect(mockInitialize).toHaveBeenCalledWith(
            expect.objectContaining({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: expect.any(Function),
            })
        );

        expect(mockRenderButton).toHaveBeenCalledTimes(1);

        expect(mockRenderButton).toHaveBeenCalledWith(
            container,
            expect.objectContaining({
                theme: "outline",
                size: "large",
                text: "signin_with",
                logo_alignment: "left",
            })
        );

        expect(window.googleInitialized).toBe(true);
    });

    it("sets user login status from the unified API response", async () => {
        const container = document.createElement("div");
        container.id = "google-signin-button";
        document.body.appendChild(container);

        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                ok: true,
                data: {
                    isAdminLogged: false,
                    loginStatus: "user",
                },
            }),
        });

        renderHook(() => useGoogleSignIn());

        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

        script?.dispatchEvent(new Event("load"));

        await waitFor(() => {
            expect(mockInitialize).toHaveBeenCalledTimes(1);
        });

        const config = mockInitialize.mock.calls[0][0];

        await config.callback({
            credential: "test-google-token",
        });

        expect(global.fetch).toHaveBeenCalledWith("/api/check-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idToken: "test-google-token",
            }),
        });

        expect(mockSetLoginStatus).toHaveBeenCalledWith("user", "google login");
    });

    it("sets admin login status from the unified API response", async () => {
        const container = document.createElement("div");
        container.id = "google-signin-button";
        document.body.appendChild(container);

        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                ok: true,
                data: {
                    isAdminLogged: true,
                    loginStatus: "admin",
                },
            }),
        });

        renderHook(() => useGoogleSignIn());

        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

        script?.dispatchEvent(new Event("load"));

        await waitFor(() => {
            expect(mockInitialize).toHaveBeenCalledTimes(1);
        });

        const config = mockInitialize.mock.calls[0][0];

        await config.callback({
            credential: "test-google-token",
        });

        expect(mockSetLoginStatus).toHaveBeenCalledWith("admin", "google login");
    });

    it("sets not_logged when the API returns an error response", async () => {
        const container = document.createElement("div");
        container.id = "google-signin-button";
        document.body.appendChild(container);

        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                ok: false,
                error: {
                    code: "EMAIL_NOT_VERIFIED",
                    message: "Email missing or not verified",
                },
            }),
        });

        renderHook(() => useGoogleSignIn());

        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

        script?.dispatchEvent(new Event("load"));

        await waitFor(() => {
            expect(mockInitialize).toHaveBeenCalledTimes(1);
        });

        const config = mockInitialize.mock.calls[0][0];

        await config.callback({
            credential: "test-google-token",
        });

        expect(mockSetLoginStatus).toHaveBeenCalledWith("not_logged", "google error");
    });

    it("sets not_logged when the request fails", async () => {
        const container = document.createElement("div");
        container.id = "google-signin-button";
        document.body.appendChild(container);

        (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

        renderHook(() => useGoogleSignIn());

        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

        script?.dispatchEvent(new Event("load"));

        await waitFor(() => {
            expect(mockInitialize).toHaveBeenCalledTimes(1);
        });

        const config = mockInitialize.mock.calls[0][0];

        await config.callback({
            credential: "test-google-token",
        });

        expect(mockSetLoginStatus).toHaveBeenCalledWith("not_logged", "google error");
    });

    it("does not initialize Google when it is already initialized", () => {
        window.googleInitialized = true;

        renderHook(() => useGoogleSignIn());

        expect(mockInitialize).not.toHaveBeenCalled();
        expect(mockRenderButton).not.toHaveBeenCalled();
        expect(document.querySelector('script[src="https://accounts.google.com/gsi/client"]')).toBeNull();
    });
});
