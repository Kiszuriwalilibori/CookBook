// "use client";
// import { useEffect, useState } from "react";

// // TypeScript: declare Google Identity Services object
// declare global {
//     interface Window {
//         google?: {
//             accounts: {
//                 id: {
//                     initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
//                     prompt: (callback?: (notification: GooglePromptNotification) => void) => void;
//                 };
//             };
//         };
//     }
// }

// interface GooglePromptNotification {
//     isNotDisplayed: boolean;
//     isSkipped: boolean;
//     isDismissed: boolean;
//     j?: string; // reason code from GIS ("missing_client_id", "unregistered_origin", etc.)
// }

// export default function UserChecker() {
//     const [isMySession, setIsMySession] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//         console.log("Client ID loaded in component:", clientId);

//         if (!clientId) {
//             console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is undefined! Check .env.local");
//             setLoading(false);
//             return;
//         }

//         const script = document.createElement("script");
//         script.src = "https://accounts.google.com/gsi/client";
//         script.async = true;
//         script.defer = true;

//         script.onload = () => {
//             if (!window.google) {
//                 console.error("GIS script did not load");
//                 setLoading(false);
//                 return;
//             }

//             console.log("GIS loaded, initializing...");

//             window.google.accounts.id.initialize({
//                 client_id: clientId,
//                 callback: async (response: { credential: string }) => {
//                     console.log("GIS callback fired", response);

//                     try {
//                         const apiRes = await fetch("/api/check-session", {
//                             method: "POST",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({ idToken: response.credential }),
//                         });

//                         const { isMySession } = (await apiRes.json()) as { isMySession: boolean };
//                         setIsMySession(isMySession);
//                     } catch (err) {
//                         console.error("Session check error:", err);
//                         setIsMySession(false);
//                     } finally {
//                         setLoading(false);
//                     }
//                 },
//             });

//             window.google.accounts.id.prompt((notification: GooglePromptNotification) => {
//                 console.log("Prompt callback:", notification);

//                 if (notification.j === "unregistered_origin") {
//                     console.warn("Origin not registered — cannot detect Google login");
//                     setIsMySession(false);
//                     setLoading(false);
//                 } else if (notification.isNotDisplayed || notification.isSkipped) {
//                     console.warn("Silent login not possible yet (first-time visit or consent required)");
//                     setIsMySession(false);
//                     setLoading(false);
//                 }
//                 // otherwise, callback will fire and set isMySession via token
//             });
//         };

//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);

//     if (loading) return <div>Ładowanie...</div>;

//     return <div>{isMySession ? <div style={{ color: "green" }}>Witaj! To Twoje konto Google</div> : <div style={{ color: "gray" }}>Zwykły użytkownik</div>}</div>;
// }
// components/UserChecker.tsx

// "use client";
// import { useState, useEffect } from "react";

// // ✅ Global type declaration for window.google
// declare global {
//     interface Window {
//         google?: {
//             accounts: {
//                 id: {
//                     initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
//                     prompt: () => void;
//                 };
//             };
//         };
//     }
// }

// export default function UserChecker() {
//     const [isMySession, setIsMySession] = useState(false);
//     const [loading, setLoading] = useState(true);

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
//             if (!window.google) return; // ✅ This line now type-checks!

//             window.google.accounts.id.initialize({
//                 client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//                 callback: handleCredentialResponse,
//             });

//             window.google.accounts.id.prompt(); // Silent login; falls back to popup
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

//                 const { isMySession } = await res.json();
//                 setIsMySession(isMySession);
//             } catch (err) {
//                 console.error("Auth error:", err);
//                 setIsMySession(false);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         // Cleanup on unmount
//         return () => {
//             const scriptEl = document.getElementById("google-script");
//             if (scriptEl) {
//                 document.body.removeChild(scriptEl);
//             }
//         };
//     }, []);

//     if (loading) return <div>Ładowanie...</div>;

//     return <div>{isMySession ? <span style={{ color: "green" }}>Witaj! To Twoje konto Google</span> : <span style={{ color: "gray" }}>Zwykły użytkownik</span>}</div>;
// }

// "use client";
// import { useState, useEffect } from "react";

// // ✅ Global type for window.google (with PromptMomentNotification)
// declare global {
//     interface Window {
//         google?: {
//             accounts: {
//                 id: {
//                     initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; promptMomentNotification?: "fire" | "login" | "never"; cancel_on_tap_outside?: boolean; use_fedcm_for_prompt?: boolean }) => void;
//                     prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void;
//                     getLastUsedContext: () => { lastUsedContext?: string } | null;
//                 };
//             };
//         };
//     }
// }

// // ✅ Type for PromptMomentNotification (from Google docs)
// interface PromptMomentNotification {
//     isNotDisplayed: () => boolean;
//     isSkippedMoment: () => boolean;
//     isNotConsent: () => boolean;
//     // Add more as needed: isDisplayed, getNotDisplayedReason, etc.
// }

// export default function UserChecker() {
//     const [isMySession, setIsMySession] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [googleReady, setGoogleReady] = useState(false); // Track if Google is initialized

//     useEffect(() => {
//         console.log("🧑‍💻 UserChecker: Starting useEffect");

//         // Avoid duplicate scripts
//         if (document.getElementById("google-script")) {
//             console.log("🧑‍💻 UserChecker: Script already loaded");
//             loadGoogle();
//             return;
//         }

//         const script = document.createElement("script");
//         script.id = "google-script";
//         script.src = "https://accounts.google.com/gsi/client";
//         script.async = true;
//         script.onload = () => {
//             console.log("🧑‍💻 UserChecker: Script loaded successfully");
//             loadGoogle();
//         };
//         script.onerror = () => {
//             console.error("🧑‍💻 UserChecker: Script failed to load");
//             setError("Failed to load Google script");
//             setLoading(false);
//         };
//         document.body.appendChild(script);

//         function loadGoogle() {
//             if (!window.google) {
//                 console.error("🧑‍💻 UserChecker: window.google not available");
//                 setError("Google library not loaded");
//                 setLoading(false);
//                 return;
//             }

//             const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//             if (!clientId) {
//                 console.error("🧑‍💻 UserChecker: NEXT_PUBLIC_GOOGLE_CLIENT_ID missing");
//                 setError("Missing Google Client ID");
//                 setLoading(false);
//                 return;
//             }

//             console.log("🧑‍💻 UserChecker: Initializing Google with Client ID:", clientId.substring(0, 20) + "...");
//             window.google.accounts.id.initialize({
//                 client_id: clientId,
//                 callback: handleCredentialResponse,
//                 promptMomentNotification: "never",
//                 cancel_on_tap_outside: false,
//                 use_fedcm_for_prompt: true,
//             });

//             // Quick silent attempt (no timeout—let it hang if fails)
//             console.log("🧑‍💻 UserChecker: Quick silent attempt");
//             window.google.accounts.id.prompt((notification: PromptMomentNotification) => {
//                 console.log("🧑‍💻 UserChecker: Prompt notification:", notification);
//                 if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
//                     console.log("🧑‍💻 UserChecker: Silent skipped—no biggie, manual available");
//                 } else if (notification.isNotConsent()) {
//                     console.log("🧑‍💻 UserChecker: No consent—manual needed");
//                     setError("Consent needed—click button");
//                 }
//             });

//             setGoogleReady(true);
//             setLoading(false); // ✅ No timeout—ready after init
//         }

//         // Cleanup
//         return () => {
//             const scriptEl = document.getElementById("google-script");
//             if (scriptEl) document.body.removeChild(scriptEl);
//         };
//     }, []);

//     const handleManualSignIn = () => {
//         console.log("🧑‍💻 UserChecker: Manual sign-in clicked");
//         setError(null);
//         setLoading(true);
//         if (!window.google?.accounts?.id) {
//             setLoading(false);
//             setError("Google not ready—reload page");
//             return;
//         }

//         // ✅ Fixed: Call prompt with callback only (no options object)
//         console.log("🧑‍💻 UserChecker: Forcing prompt");
//         window.google.accounts.id.prompt((notification: PromptMomentNotification) => {
//             console.log("🧑‍💻 UserChecker: Manual prompt notification:", notification);
//             setLoading(false);
//             if (notification.isNotDisplayed()) {
//                 setError("Popup blocked—allow popups and try again");
//             }
//         });
//     };

//     async function handleCredentialResponse(response: { credential: string }) {
//         console.log("🧑‍💻 UserChecker: 🎉 Callback fired with token!");
//         setLoading(false);

//         try {
//             const idToken = response.credential;
//             console.log("🧑‍💻 UserChecker: Token length:", idToken.length); // Debug token
//             const res = await fetch("/api/check-session", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idToken }),
//             });

//             if (!res.ok) {
//                 console.error("🧑‍💻 UserChecker: API error:", res.status, res.statusText);
//                 throw new Error(`API failed: ${res.status}`);
//             }

//             const { isMySession } = await res.json();
//             console.log("🧑‍💻 UserChecker: API success:", isMySession);
//             setIsMySession(isMySession);
//             setError(null);
//         } catch (err) {
//             console.error("🧑‍💻 UserChecker: Auth error:", err);
//             setError("Verification failed—check API or console");
//             setIsMySession(false);
//         }
//     }

//     if (loading) {
//         return <div>Ładowanie Google...</div>;
//     }

//     return (
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             {error && <span style={{ color: "red" }}>Błąd: {error}</span>}
//             {isMySession ? <span style={{ color: "green" }}>Witaj! To Twoje konto Google</span> : <span style={{ color: "gray" }}>Zwykły użytkownik</span>}
//             {googleReady && !isMySession && (
//                 <button onClick={handleManualSignIn} style={{ padding: "4px 8px", fontSize: 12 }}>
//                     Zaloguj się ręcznie
//                 </button>
//             )}
//         </div>
//     );
// }

"use client";
import { useAdminStore } from "@/stores/useAdminStore";
import { useEffect } from "react";
// Adjust path as needed

// ✅ Global type declaration for window.google
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

export default function UserChecker() {
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
            if (!window.google) return; // ✅ This line now type-checks!

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleCredentialResponse,
            });

            window.google.accounts.id.prompt(); // Silent login; falls back to popup
        }

        async function handleCredentialResponse(response: { credential: string }) {
            try {
                const idToken = response.credential;
                const res = await fetch("/api/check-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                if (!res.ok) throw new Error("Verification failed");

                const { isAdminLogged } = await res.json();
                setAdminLogged(isAdminLogged, isAdminLogged ? "Admin login verified via Google ID token" : "Admin check passed but email mismatch—reset to false");
            } catch (err) {
                console.error("Auth error:", err);
                setAdminLogged(false, "Admin verification failed (e.g., invalid token or network error)—reset to false");
            }
        }

        // Initial state set (in case of cold load)
        setAdminLogged(false, "UserChecker mounted—initializing admin state to false");

        // Cleanup on unmount
        return () => {
            const scriptEl = document.getElementById("google-script");
            if (scriptEl) {
                document.body.removeChild(scriptEl);
            }
        };
    }, [setAdminLogged]);

    return null; // Silent render—no UI output
}
