// src/hooks/useGoogleSignIn.ts
"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";

export const useGoogleSignIn = () => {
    const { isAdminLogged, setAdminLogged } = useAdminStore();

    useEffect(() => {
        // Jeśli już zalogowany – nie ładuj Google wcale
        if (isAdminLogged) {
            console.log("[Admin] Już zalogowany (z localStorage) → pomijam Google");
            return;
        }

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
                        const { isAdminLogged } = await res.json();
                        console.log(`[Admin] Google login → ${isAdminLogged ? "sukces" : "odmowa"}`);
                        setAdminLogged(isAdminLogged, "google login");
                    } catch {
                        console.log("[Admin] Błąd logowania Google");
                        setAdminLogged(false, "google error");
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
    }, [isAdminLogged, setAdminLogged]);
};
