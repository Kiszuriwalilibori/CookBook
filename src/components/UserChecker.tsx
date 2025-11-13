"use client";
import { useEffect, useState } from "react";

// TypeScript: add `window.google`
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
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initGoogle;
        document.body.appendChild(script);

        async function initGoogle() {
            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: async (response: { credential: string }) => {
                    try {
                        const idToken = response.credential;
                        const apiRes = await fetch("/api/check-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ idToken }),
                        });

                        const { isMySession } = (await apiRes.json()) as { isMySession: boolean };
                        setIsMySession(isMySession);
                    } catch (err) {
                        console.error("Session check error:", err);
                        setIsMySession(false);
                    } finally {
                        setLoading(false);
                    }
                },
            });

            window.google.accounts.id.prompt(); // silent login if possible
        }
    }, []);

    if (loading) return <div>Ładowanie...</div>;

    return <div>{isMySession ? <div style={{ color: "green" }}>Witaj! To Twoje konto Google</div> : <div style={{ color: "gray" }}>Zwykły użytkownik</div>}</div>;
}
