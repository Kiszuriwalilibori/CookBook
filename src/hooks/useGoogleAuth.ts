import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";

// Global types (przenieś do dedykowanego pliku .d.ts jeśli chcesz, np. types/google.d.ts)
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean; prompt?: "none" | "consent" | "select_account" }) => void;
                    prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void;
                    getLastCredential: () => { credential: string } | null;
                };
            };
        };
        googleInitialized?: boolean;
    }
}

export const useGoogleAuth = () => {
    // Separate selectors to avoid SSR loop
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);
    const setAdminLogged = useAdminStore(state => state.setAdminLogged);

    useEffect(() => {
        // Load Google script once
        if (document.getElementById("google-script")) return;

        const script = document.createElement("script");
        script.id = "google-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initGoogle;
        document.body.appendChild(script);

        function initGoogle() {
            if (!window.google) return;
            if (window.googleInitialized) return;

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleCredentialResponse,
                auto_select: true,
                prompt: "none", // Silent only—no UI fallback
            });

            window.googleInitialized = true;

            // Silent-first: If persisted admin, try cached credential
            if (isAdminLogged) {
                trySilentCredential();
            } else {
                console.log("[GoogleAuth] Persist false—skipping prompt on load");
            }
        }

        const trySilentCredential = async () => {
            try {
                const cached = window.google?.accounts?.id?.getLastCredential();
                if (cached?.credential) {
                    console.log("[GoogleAuth] Silent cached verify");
                    await handleCredentialResponse(cached);
                    return; // Success—skip prompt
                }
            } catch (_err) {
                console.log("[GoogleAuth] Cached failed—trying prompt", _err);
            }
            // Fallback: prompt silent
            window.google?.accounts?.id?.prompt(notification => {
                if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.log(`[GoogleAuth] Prompt skipped: ${reason}`);
                } else {
                    console.log("[GoogleAuth] Prompt displayed—user interacted");
                }
            });
        };

        async function handleCredentialResponse(response: { credential: string }) {
            try {
                const idToken = response.credential;
                const res = await fetch("/api/check-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                if (!res.ok) throw new Error("Verification failed");

                const { isAdminLogged: verified } = await res.json();
                setAdminLogged(verified, verified ? "Admin verified (cached or silent)" : "Token received but email mismatch—admin access denied");
            } catch (_err) {
                console.error("Auth error:", _err);
                setAdminLogged(false, "Admin verification failed (e.g., invalid token or network error)—reset to false");
            }
        }

        // Cleanup on unmount
        return () => {
            const scriptEl = document.getElementById("google-script");
            if (scriptEl) document.body.removeChild(scriptEl);
        };
    }, [isAdminLogged, setAdminLogged]); // Deps zgodne z exhaustive-deps
};
