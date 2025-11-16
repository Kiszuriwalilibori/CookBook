import { useEffect, useCallback } from "react"; // DODANE: useCallback
import { useAdminStore } from "@/stores/useAdminStore";

// Global types (bez zmian)
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean; prompt?: "none" | "consent" | "select_account"; use_fedcm_for_prompt?: boolean }) => void;
                    prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void;
                    getLastCredential: () => { credential: string } | null;
                };
            };
        };
        googleInitialized?: boolean;
    }
}

export const useGoogleAuth = () => {
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);
    const setAdminLogged = useAdminStore(state => state.setAdminLogged);

    // FIX ESLINT: Przenieś handleCredentialResponse poza effect i owiń w useCallback
    // To stabilizuje closure, deps exhaustive, a effect nie re-runa niepotrzebnie
    const handleCredentialResponse = useCallback(
        async (response: { credential: string }) => {
            try {
                const idToken = response.credential;
                const res = await fetch("/api/check-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                if (!res.ok) throw new Error("Verification failed");

                const { isAdminLogged: verified } = await res.json();
                const logMsg = verified ? "Admin verified (FedCM silent/cached/prompt)" : "Token received but email mismatch—admin access denied";
                setAdminLogged(verified, logMsg);
                console.log(`[GoogleAuth] ${logMsg}`);
            } catch (err) {
                console.error("[GoogleAuth] Auth error:", err);
                setAdminLogged(false, "Admin verification failed (e.g., invalid token or network error)—reset to false");
            }
        },
        [setAdminLogged]
    ); // Dep: setAdminLogged – stabilne z Zustand, nie zmieni się

    useEffect(() => {
        if (document.getElementById("google-script")) return;

        const script = document.createElement("script");
        script.id = "google-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
            initGoogle();
        };
        document.body.appendChild(script);

        function initGoogle() {
            if (!window.google) {
                console.error("[GoogleAuth] Google script loaded but window.google missing");
                return;
            }
            if (window.googleInitialized) return;

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleCredentialResponse, // Teraz stabilne, bez re-init
                auto_select: true,
                prompt: "select_account",
                use_fedcm_for_prompt: true,
            });

            window.googleInitialized = true;

            setTimeout(() => trySilentAuth(), 500);
        }

        const trySilentAuth = async () => {
            console.log("[GoogleAuth] Starting silent auth attempt (FedCM-enabled)");

            const getLastCredential = window.google?.accounts?.id?.getLastCredential;
            if (typeof getLastCredential !== "function") {
                console.warn("[GoogleAuth] getLastCredential not available – skipping cache, prompting directly (FedCM handles silent)");
            } else {
                try {
                    const cached = getLastCredential();
                    if (cached?.credential) {
                        console.log("[GoogleAuth] Using cached credential");
                        await handleCredentialResponse(cached);
                        return;
                    }
                } catch (err) {
                    console.log("[GoogleAuth] Cached credential failed:", err);
                }
            }

            console.log("[GoogleAuth] No cached/success – prompting (FedCM flow)");
            window.google?.accounts?.id?.prompt();
        };

        return () => {
            const scriptEl = document.getElementById("google-script");
            if (scriptEl) document.body.removeChild(scriptEl);
            window.googleInitialized = false;
        };
        // FIX ESLINT: Dodaj handleCredentialResponse do deps (stabilne dzięki useCallback)
        // Ale skoro to callback z deps [setAdminLogged], i setAdminLogged stabilne – effect re-runa rzadko
    }, [handleCredentialResponse]);

    useEffect(() => {
        if (!isAdminLogged) {
            console.log("[GoogleAuth] isAdminLogged changed to false – consider re-prompt if needed");
        }
    }, [isAdminLogged]);
};
