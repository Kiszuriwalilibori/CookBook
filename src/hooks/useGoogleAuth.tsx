// import { useEffect, useCallback } from "react"; // DODANE: useCallback
// import { useAdminStore } from "@/stores/useAdminStore";

// // Global types (bez zmian)
// declare global {
//     interface Window {
//         google?: {
//             accounts: {
//                 id: {
//                     initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean; prompt?: "none" | "consent" | "select_account"; use_fedcm_for_prompt?: boolean }) => void;
//                     prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void;
//                     getLastCredential: () => { credential: string } | null;
//                 };
//             };
//         };
//         googleInitialized?: boolean;
//     }
// }

// export const useGoogleAuth = () => {
//     const isAdminLogged = useAdminStore(state => state.isAdminLogged);
//     const setAdminLogged = useAdminStore(state => state.setAdminLogged);

//     // FIX ESLINT: Przenieś handleCredentialResponse poza effect i owiń w useCallback
//     // To stabilizuje closure, deps exhaustive, a effect nie re-runa niepotrzebnie
//     const handleCredentialResponse = useCallback(
//         async (response: { credential: string }) => {
//             try {
//                 const idToken = response.credential;
//                 const res = await fetch("/api/check-session", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ idToken }),
//                 });

//                 if (!res.ok) throw new Error("Verification failed");

//                 const { isAdminLogged: verified } = await res.json();
//                 const logMsg = verified ? "Admin verified (FedCM silent/cached/prompt)" : "Token received but email mismatch—admin access denied";
//                 setAdminLogged(verified, logMsg);
//                 console.log(`[GoogleAuth] ${logMsg}`);
//             } catch (err) {
//                 console.error("[GoogleAuth] Auth error:", err);
//                 setAdminLogged(false, "Admin verification failed (e.g., invalid token or network error)—reset to false");
//             }
//         },
//         [setAdminLogged]
//     ); // Dep: setAdminLogged – stabilne z Zustand, nie zmieni się

//     useEffect(() => {
//         if (document.getElementById("google-script")) return;

//         const script = document.createElement("script");
//         script.id = "google-script";
//         script.src = "https://accounts.google.com/gsi/client";
//         script.async = true;
//         script.onload = () => {
//             initGoogle();
//         };
//         document.body.appendChild(script);

//         function initGoogle() {
//             if (!window.google) {
//                 console.error("[GoogleAuth] Google script loaded but window.google missing");
//                 return;
//             }
//             if (window.googleInitialized) return;

//             window.google.accounts.id.initialize({
//                 client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//                 callback: handleCredentialResponse, // Teraz stabilne, bez re-init
//                 auto_select: true,
//                 prompt: "select_account",
//                 use_fedcm_for_prompt: true,
//             });

//             window.googleInitialized = true;

//             setTimeout(() => trySilentAuth(), 500);
//         }

//         const trySilentAuth = async () => {
//             console.log("[GoogleAuth] Starting silent auth attempt (FedCM-enabled)");

//             const getLastCredential = window.google?.accounts?.id?.getLastCredential;
//             if (typeof getLastCredential !== "function") {
//                 console.warn("[GoogleAuth] getLastCredential not available – skipping cache, prompting directly (FedCM handles silent)");
//             } else {
//                 try {
//                     const cached = getLastCredential();
//                     if (cached?.credential) {
//                         console.log("[GoogleAuth] Using cached credential");
//                         await handleCredentialResponse(cached);
//                         return;
//                     }
//                 } catch (err) {
//                     console.log("[GoogleAuth] Cached credential failed:", err);
//                 }
//             }

//             console.log("[GoogleAuth] No cached/success – prompting (FedCM flow)");
//             window.google?.accounts?.id?.prompt();
//         };

//         return () => {
//             const scriptEl = document.getElementById("google-script");
//             if (scriptEl) document.body.removeChild(scriptEl);
//             window.googleInitialized = false;
//         };
//         // FIX ESLINT: Dodaj handleCredentialResponse do deps (stabilne dzięki useCallback)
//         // Ale skoro to callback z deps [setAdminLogged], i setAdminLogged stabilne – effect re-runa rzadko
//     }, [handleCredentialResponse]);

//     useEffect(() => {
//         if (!isAdminLogged) {
//             console.log("[GoogleAuth] isAdminLogged changed to false – consider re-prompt if needed");
//         }
//     }, [isAdminLogged]);
// };

"use client";
import { useCallback, useEffect, useRef } from "react";
import { useAdminStore } from "@/stores/useAdminStore";

// --- global typings (kept local to this file for convenience) ---
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean; prompt?: "none" | "consent" | "select_account"; use_fedcm_for_prompt?: boolean }) => void;
                    prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void;
                    getLastCredential: () => { credential: string } | null;
                    disableAutoSelect: () => void;
                };
            };
        };
        googleInitialized?: boolean;
    }
}

/**
 * Clean, minimal Google auth hook with FedCM-friendly silent-first flow.
 * - Initializes GSI script once
 * - Attempts cached credential -> auto_select silent flow
 * - Never forces a UI prompt on page load
 * - Exposes login() to trigger interactive prompt and logout() to clear auto-select
 */
export function useGoogleAuth({
    clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
}: {
    clientId?: string;
} = {}) {
    const isAdminLogged = useAdminStore(s => s.isAdminLogged);
    const setAdminLogged = useAdminStore(s => s.setAdminLogged);

    // Stable ref to avoid effect re-runs when callbacks change
    const initializedRef = useRef(false);

    // Stable credential handler
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

                const data = await res.json();
                const verified = Boolean(data?.isAdminLogged);
                const logMsg = verified ? "Admin verified (FedCM / cached token)" : "Token validated but not admin — access denied";
                setAdminLogged(verified, logMsg);
                console.log("[GoogleAuth]", logMsg);
            } catch (err) {
                console.error("[GoogleAuth] Auth error:", err);
                setAdminLogged(false, "Admin verification failed (invalid token or network)");
            }
        },
        [setAdminLogged]
    );

    // Load script + initialize
    useEffect(() => {
        if (!clientId) {
            console.warn("[GoogleAuth] No clientId provided; skipping init");
            return;
        }

        if (initializedRef.current) return;

        const existing = document.getElementById("google-gsi-script");
        if (existing) {
            // If script already loaded but our global flag isn't set, try init safely
            if (window.google && !window.googleInitialized) {
                tryInit();
            }
            initializedRef.current = true;
            return;
        }

        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            tryInit();
        };
        script.onerror = e => {
            console.error("[GoogleAuth] Failed to load Google script", e);
        };

        document.head.appendChild(script);
        initializedRef.current = true;

        function tryInit() {
            if (!window.google?.accounts?.id) return;
            if (window.googleInitialized) return;

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse,
                auto_select: true, // allow silent auto-select when possible
                use_fedcm_for_prompt: true, // keep FedCM behavior
            });

            window.googleInitialized = true;

            // Attempt silent auth but DO NOT force UI. Let Google decide to display UI only
            // if it thinks an interactive prompt is needed. We log reasons for debugging.
            trySilentAuth();
        }

        async function trySilentAuth() {
            console.log("[GoogleAuth] Silent auth attempt starting");

            // 1) Try getLastCredential (cached token)
            try {
                const getLast = window.google?.accounts?.id?.getLastCredential;
                if (typeof getLast === "function") {
                    const cached = getLast();
                    if (cached?.credential) {
                        console.log("[GoogleAuth] Using cached credential");
                        await handleCredentialResponse(cached);
                        return;
                    }
                }
            } catch (e) {
                console.warn("[GoogleAuth] getLastCredential failed:", e);
            }

            // 2) Let auto_select / prompt run silently. Provide listener to avoid forcing UI
            try {
                window.google?.accounts?.id?.prompt(notification => {
                    if (notification.isNotDisplayed()) {
                        console.log("[GoogleAuth] prompt not displayed:", notification.getNotDisplayedReason());
                        // Common reasons: "user_not_signed_up", "suppressed_by_user_setting", "credential_returned" etc.
                        // We deliberately DO NOT call prompt() ourselves here to avoid forcing UI.
                    }
                });
            } catch (e) {
                console.warn("[GoogleAuth] prompt() call failed:", e);
            }
        }

        return () => {
            // On unmount we keep the script around to avoid re-downloads across route changes.
            // If you need to fully clean up (e.g., SPA hot reload dev), you can remove it here.
        };
    }, [clientId, handleCredentialResponse]);

    // Expose imperative login / logout utilities
    const login = useCallback(() => {
        // Trigger an interactive prompt explicitly when user requests it
        if (!window.google?.accounts?.id) {
            console.warn("[GoogleAuth] Google API not ready yet");
            return;
        }

        // Use prompt() to show UI — this is user-initiated so acceptable
        window.google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed()) {
                console.log("[GoogleAuth] Interactive prompt not displayed:", notification.getNotDisplayedReason());
            }
        });
    }, []);

    const logout = useCallback(() => {
        // Clear local app state and ask GSI to disable auto-select so it doesn't re-pick the cached account
        setAdminLogged(false, "Logged out by user");
        try {
            window.google?.accounts?.id?.disableAutoSelect?.();
            console.log("[GoogleAuth] disableAutoSelect called");
        } catch (e) {
            console.warn("[GoogleAuth] disableAutoSelect failed:", e);
        }
    }, [setAdminLogged]);

    return { isAdminLogged, login, logout } as const;
}

// Minimal AuthProvider wrapper you can drop in _app or RootLayout
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Call hook to run initialization side-effects
    useGoogleAuth();
    return <>{children}</>;
}
// To jest wersja z GPT chat
