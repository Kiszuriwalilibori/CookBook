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

"use client";
import { useState, useEffect } from "react";

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
    const [isMySession, setIsMySession] = useState(false);
    const [loading, setLoading] = useState(true);

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

                const { isMySession } = await res.json();
                setIsMySession(isMySession);
            } catch (err) {
                console.error("Auth error:", err);
                setIsMySession(false);
            } finally {
                setLoading(false);
            }
        }

        // Cleanup on unmount
        return () => {
            const scriptEl = document.getElementById("google-script");
            if (scriptEl) {
                document.body.removeChild(scriptEl);
            }
        };
    }, []);

    if (loading) return <div>Ładowanie...</div>;

    return <div>{isMySession ? <span style={{ color: "green" }}>Witaj! To Twoje konto Google</span> : <span style={{ color: "gray" }}>Zwykły użytkownik</span>}</div>;
}
