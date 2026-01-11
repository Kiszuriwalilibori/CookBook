"use client";
import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";

export const useGoogleSignIn = () => {
    const { setLoginStatus } = useAdminStore();

    useEffect(() => {
        // Jeśli już załadowany – nie ładuj drugi raz
        if (window.googleInitialized) return;

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
            if (!window.google?.accounts?.id) return;

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: async (response: { credential: string }) => {
                    try {
                        const res = await fetch("/api/check-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ idToken: response.credential }),
                        });
                        const { loginStatus } = await res.json();
                        console.log(`[Auth] Google login → ${loginStatus}`);
                        setLoginStatus(loginStatus, "google login");
                    } catch {
                        console.log("[Auth] Błąd logowania Google");
                        setLoginStatus("not_logged", "google error");
                    }
                },
            });

            const container = document.getElementById("google-signin-button");
            if (container) {
                window.google.accounts.id.renderButton(container, {
                    theme: "outline",
                    size: "large",
                    text: "signin_with",
                    logo_alignment: "left",
                });
            }

            window.googleInitialized = true;
        };

        document.head.appendChild(script);
    }, [setLoginStatus]);
};
