// "use client";
// import { useEffect } from "react";
// import { useAdminStore } from "@/stores/useAdminStore"; // Adjust path

// // ✅ Global type declaration for window.google (with our flag)
// declare global {
//     interface Window {
//         google?: {
//             accounts: {
//                 id: {
//                     initialize: (config: {
//                         client_id: string;
//                         callback: (response: { credential: string }) => void;
//                         auto_select?: boolean; // Added for silent flow
//                     }) => void;
//                     prompt: (
//                         momentListener?: (notification: {
//                             isNotDisplayed: () => boolean;
//                             getNotDisplayedReason: () => string;
//                             // Add other notification methods if needed
//                         }) => void
//                     ) => void;
//                 };
//             };
//         };
//         googleInitialized?: boolean; // Our custom flag for init tracking
//     }
// }

// export default function UserChecker() {
//     const setAdminLogged = useAdminStore(state => state.setAdminLogged);

//     useEffect(() => {
//         // Load Google script once
//         if (document.getElementById("google-script")) return; // Avoid duplicates

//         const script = document.createElement("script");
//         script.id = "google-script";
//         script.src = "https://accounts.google.com/gsi/client";
//         script.async = true;
//         script.onload = initGoogle;
//         document.body.appendChild(script);

//         function initGoogle() {
//             if (!window.google) return;

//             // Skip re-init if already set up
//             if (window.googleInitialized) return;

//             window.google.accounts.id.initialize({
//                 client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//                 callback: handleCredentialResponse,
//                 auto_select: true, // ✅ Enables silent token fetch for existing sessions—no UI!
//             });

//             // Set the flag post-init
//             window.googleInitialized = true;

//             // ✅ Trigger silent prompt (UI only if multiple accounts needed)
//             window.google.accounts.id.prompt(notification => {
//                 if (notification.isNotDisplayed()) {
//                     const reason = notification.getNotDisplayedReason();
//                     console.log(`[UserChecker] Prompt skipped (no UI): ${reason}`); // e.g., "opt_out_or_no_session"
//                     // No callback fires here—state stays false for manual trigger
//                 } else {
//                     console.log("[UserChecker] Prompt displayed—user interacted");
//                 }
//             });
//         }

//         async function handleCredentialResponse(response: { credential: string }) {
//             try {
//                 const idToken = response.credential;
//                 const res = await fetch("/api/check-session", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ idToken }),
//                 });

//                 if (!res.ok) throw new Error("Verification failed");

//                 const { isAdminLogged } = await res.json();
//                 setAdminLogged(isAdminLogged, isAdminLogged ? "Admin login verified silently via existing Google session" : "Token received but email mismatch—admin access denied");
//             } catch (err) {
//                 console.error("Auth error:", err);
//                 setAdminLogged(false, "Admin verification failed (e.g., invalid token or network error)—reset to false");
//             }
//         }

//         // Cleanup on unmount
//         return () => {
//             const scriptEl = document.getElementById("google-script");
//             if (scriptEl) {
//                 document.body.removeChild(scriptEl);
//             }
//             window.googleInitialized = false; // Reset flag
//         };
//     }, [setAdminLogged]);

//     return null; // Silent
// }

"use client";
import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";

// ✅ Global type declaration for window.google (extended for getLastCredential)
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean; prompt?: "none" | "consent" | "select_account" }) => void;
                    prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void;
                    getLastCredential: () => { credential: string } | null; // For cached token
                };
            };
        };
        googleInitialized?: boolean; // Our custom flag for init tracking
    }
}

export default function UserChecker() {
    // Separate selectors to avoid object creation and SSR loop
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);
    const setAdminLogged = useAdminStore(state => state.setAdminLogged);

    useEffect(() => {
        // Load Google script once
        if (document.getElementById("google-script")) return; // Avoid duplicates

        const script = document.createElement("script");
        script.id = "google-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initGoogle;
        document.body.appendChild(script);

        function initGoogle() {
            if (!window.google) return;

            // Skip re-init if already set up
            if (window.googleInitialized) return;

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleCredentialResponse,
                auto_select: true, // ✅ Enables silent token fetch for existing sessions—no UI!
                prompt: "none", // Stricter: silent only, no UI fallback
            });

            // Set the flag post-init
            window.googleInitialized = true;

            // ✅ Silent-first: If persisted admin, try cached credential
            if (isAdminLogged) {
                trySilentCredential();
            } else {
                console.log("[UserChecker] Persist false—skipping prompt on load");
            }
        }

        const trySilentCredential = async () => {
            try {
                const cached = window.google?.accounts?.id?.getLastCredential();
                if (cached?.credential) {
                    console.log("[UserChecker] Silent cached verify");
                    await handleCredentialResponse(cached);
                    return; // Success—skip prompt
                }
            } catch (_err) {
                // Unused err—silence ESLint
                console.log("[UserChecker] Cached failed—trying prompt", _err);
            }
            // Fallback: prompt silent (with 'none'—no UI if possible)
            window.google?.accounts?.id?.prompt(notification => {
                if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.log(`[UserChecker] Prompt skipped: ${reason}`);
                } else {
                    console.log("[UserChecker] Prompt displayed—user interacted");
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
                // Unused err—silence ESLint
                console.error("Auth error:", _err);
                setAdminLogged(false, "Admin verification failed (e.g., invalid token or network error)—reset to false");
            }
        }

        // Cleanup on unmount
        return () => {
            const scriptEl = document.getElementById("google-script");
            if (scriptEl) {
                document.body.removeChild(scriptEl);
            }
            // Nie resetuj flagi—persist obsługuje stan
        };
    }, [isAdminLogged, setAdminLogged]); // Dodaj deps—zgodne z exhaustive-deps

    return null; // Silent
}
